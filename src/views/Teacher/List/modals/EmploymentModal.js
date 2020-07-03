import React, { useEffect, useState } from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../utils/Proxy';
import DataExtract       from '../../../../utils/DataExtract';
import ExcelInfo     from '../../../../utils/ExcelInfo';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TextareaAutosize
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: 'none',
      boxShadow: theme.shadows[20],
      width: 1800,
      maxHeight: '100%',
      overflowY: 'auto',
      maxWidth: '100%'
    },
    actions: {
      justifyContent: 'flex-end'
    },
    selectBox:{
      height: 42,
      width:120,
    },
    textFiled:{
      width:200,
    },
    radio:{
      display:'inline-block', 
      width:150
    },
    dateField: {
      '& + &': {
        width: 140,
        marginLeft: theme.spacing(2)
      }
    },
    
  }));

/**
 * 재직증명서
 * @param {*} param0 
 */
function EmploymentModal({ open, onClose, editable, issued, documentInfo, search, contacts, className, ...rest }) {
    const classes = useStyles();

    /**
     * 계약목록을 문자열로 변환한다.
     * @param {*} mycontacts 
     * @param {*} delimeter 
     */
    const printContacts = (mycontacts, from , to, delimeter) => {
      let result = new Array();
      for(let i=0; i<mycontacts.length; i++){
        let contact = mycontacts[i];

        //첫번째에 seit가 2번 생기는 문제로 분기
        if(i === 0){
          result.push(`${DataExtract.getFommatedDate2(contact.contactStartDate,'.')}${to}${DataExtract.getFommatedDate2(contact.realEndDate,'.')}`);
        }else{
          result.push(`${from}${DataExtract.getFommatedDate2(contact.contactStartDate,'.')}${to}${DataExtract.getFommatedDate2(contact.realEndDate,'.')}`);
        }
      }//for
      return result.join(`${delimeter}`);
    }//

    /**
     * 멘트 생성
     */
    const makeComment = () => {
      let comment = '';
      if(editable.resignDay !== ''){
        comment = DataExtract.findItemValue(documentInfo, 'comment1');
      }else{
        comment = DataExtract.findItemValue(documentInfo, 'comment2');
      }
      
      let t1 = '';
      let endDate = document.getElementById('endDate').value;
      endDate = endDate.replace('-','').replace('-', '');
      endDate = DataExtract.getFommatedDate2(endDate, '.');


      if(contacts && contacts.length > 0){
        t1 = printContacts(contacts, 'seit ', ' bis ', ', ') + endDate;
      }else{
        if(editable.resignDay !== ''){
          //퇴사자인 경우 퇴사일자까지 나와야 한다.
          t1 = DataExtract.getFommatedDate2(editable.joinDay, '.') +  ' bis ' + DataExtract.getFommatedDate2(editable.resignDay, '.');
        }else{
          t1 = DataExtract.getFommatedDate2(editable.joinDay, '.') +  ' bis ' + endDate;
        }
      }

      let t2 = editable.gender === 'W' ? 'Lehrerin' : 'Lehrer';
      let t3 = editable.gender === 'W' ? 'Sie' : 'Er';
      let t4 = document.getElementById('salary').value;
      let t5 = endDate;
      
      comment = comment.replace('@t1', t1);
      comment = comment.replace('@t2', t2);
      comment = comment.replace('@t3', t3);
      comment = comment.replace('@t4', t4);
      comment = comment.replace('@t5', t5);
      document.getElementById('comment').value = comment;
    }//makeComment
    
    /**
     * 엑셀변환
     */
    const print = async () => {
      const url = '/api/print/excel/employment';
      const formData = new FormData(); 
      formData.append('documentInfo', JSON.stringify(documentInfo));
      formData.append('issued', JSON.stringify(issued));  
      editable.salary = document.getElementById('salary').value;
      editable.comment = document.getElementById('comment').value;
      editable.creId = 'root';

      if(editable.gender === 'W'){
        editable.title = 'Frau';
      }else{
        editable.title = 'Herr';
      }

      formData.append('editable', JSON.stringify(editable));  

      const config = {
          headers : { 'content-type' : 'multipart/form-data'  },
          proxy: Proxy.ProxyConfig
      }

      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert(`${ExcelInfo.EmploymentDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
          }else{
            alert(response.data.message);
          }
          onClose();
      });
    }//makeExcel

    return (
        <Modal
            onClose={onClose}
            open={open}
        > 
            <Card
            {...rest}
            className={clsx(classes.root, className)}
            >  
            <form id="form">                  
                <CardHeader title="교사 재직증명서 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">발급대상</TableCell>
                                <TableCell align="left">{editable.teacherName} </TableCell>  

                                <TableCell align="left">발급일자</TableCell>
                                <TableCell align="left">{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell> 

                                <TableCell align="left">발급번호</TableCell>
                                <TableCell align="left">{issued.issuedDate}-{issued.documentType}-{issued.seqNo}</TableCell>  

                                <TableCell align="left">급여</TableCell>
                                <TableCell align="left">                                  
                                  <TextField
                                      name="salary"
                                      id="salary"
                                      variant="outlined"
                                      className={classes.textFiled}
                                      onChange={makeComment}
                                    />   
                                </TableCell>  
                                <TableCell align="left">종료일자</TableCell>
                                <TableCell align="left">
                                  <TextField
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    defaultValue=""
                                    className={classes.dateField}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    onChange={makeComment}
                                  />    
                                </TableCell>                   
                            </TableRow>

                            <TableRow>
                              <TableCell align="left">계약목록</TableCell>
                              <TableCell align="left" colSpan="8">
                                {(contacts && contacts.length > 0) ? printContacts(contacts, '', '~', ', ') : "등록된 계약이 없습니다."}
                              </TableCell>                       
                            </TableRow>

                            <TableRow>
                                <TableCell align="left" style={{height:200}}>내용</TableCell>
                                <TableCell align="left" colSpan="8">                   
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      rows={4}
                                      rowsMax={10}
                                      aria-label="maximum height"
                                      style={{width:800,height:130}}
                                    />
                                </TableCell>                    
                            </TableRow>
                        </TableBody>
                    </Table>

                </CardContent>
                <Divider />
                <CardActions className={classes.actions}>
                     <Button color="primary"
                            variant="contained"
                            onClick={onClose}>
                    닫기
                    </Button>
                     <Button color="primary"
                            variant="contained"
                          onClick={() => print()}>
                    출력
                    </Button>
                </CardActions>
              </form>
            </Card>            
        </Modal>
    );
}


EmploymentModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  EmploymentModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  


export default EmploymentModal;