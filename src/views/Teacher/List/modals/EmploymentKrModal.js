import React, { useEffect, useState } from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../utils/Proxy';
import DataExtract       from '../../../../utils/DataExtract';
import CommonCode    from '../../../../utils/CommonCode';
import SpecialCommonCode    from '../../../../utils/SpecialCommonCode';
import ExcelInfo     from '../../../../utils/ExcelInfo';
import Valid from '../../../../utils/Valid';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: 'none',
      boxShadow: theme.shadows[20],
      width: 1000,
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
      width:400,
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
function EmploymentKrModal({ open, onClose, editable, issued, documentInfo, search, className, ...rest }) {
    const classes = useStyles();

    /**
     * 멘트 생성
     */
    const makeCommentKr = (comment, joinDay, resignDay, issuedDate) => {
        //위의 사람은 프랑크푸르트 한국학교 교사로서 @t1부터 @t2까지 재직하고 있음을 증명함. 프랑크푸르트, @t3

        if(DataExtract.isNotNull(joinDay)){
            joinDay = joinDay.substring(0,4) + '년 ' + joinDay.substring(4,6) + '월 ' + joinDay.substring(6,8) + '일';
            comment = DataExtract.isNull(comment) ? comment : comment.replace('@t1', joinDay);
        }

        if(DataExtract.isNotNull(resignDay)){
            resignDay = resignDay.substring(0,4) + '년 ' + resignDay.substring(4,6) + '월 ' + resignDay.substring(6,8) + '일';
            comment = DataExtract.isNull(comment) ? comment : comment.replace('@t2', resignDay);
        }else{
          comment = DataExtract.isNull(comment) ? comment : comment.replace('@t2', '현재');
        }

        if(DataExtract.isNotNull(issuedDate)){
            issuedDate = issuedDate.substring(0,4) + '년 ' + issuedDate.substring(4,6) + '월 ' + issuedDate.substring(6,8) + '일';
            comment = DataExtract.isNull(comment) ? comment : comment.replace('@t3', issuedDate);
        }
        return comment;
    }//makeCommentKr
    
    /**
     * 한글 재직증명서 엑셀변환
     */
    const print = async () => {
      const url = '/api/print/excel/employmentkr';
      const formData = new FormData(); 
      formData.append('documentInfo', JSON.stringify(documentInfo));
      formData.append('issued', JSON.stringify(issued));  
      editable.comment = document.getElementById('comment').value;
      editable.creId = 'root';

      formData.append('editable', JSON.stringify(editable));  

      const config = {
          headers : { 'content-type' : 'multipart/form-data'  },
          proxy: Proxy.ProxyConfig
      }

      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert(`${ExcelInfo.EmploymentKrDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
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
                <CardHeader title="교사 재직증명서(한글) 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">발급대상</TableCell>
                                <TableCell align="left" colSpan="5">{editable.teacherName} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급일자</TableCell>
                                <TableCell align="left" colSpan="5">{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급번호</TableCell>
                                <TableCell align="left" colSpan="5">{issued.issuedDate}-{issued.documentType}-{issued.seqNo}</TableCell>                   
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">내용</TableCell>
                                <TableCell align="left" colSpan="6">                   
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      rows={4}
                                      rowsMax={10}
                                      defaultValue={makeCommentKr(DataExtract.findItemValue(documentInfo, 'comment'), editable.joinDay, issued.resignDay, issued.issuedDate)}
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


EmploymentKrModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  EmploymentKrModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  


export default EmploymentKrModal;