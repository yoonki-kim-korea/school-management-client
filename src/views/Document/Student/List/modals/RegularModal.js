import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../../utils/Proxy';
import DataExtract       from '../../../../../utils/DataExtract';
import ExcelInfo     from '../../../../../utils/ExcelInfo';
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
    selectBox2:{
      height: 42,
      width:500,
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
 * 정근상장
 * @param {*} param0 
 */
function RegularModal({ open, onClose, editable, issued, documentInfo, search, className, ...rest }) {
    const classes = useStyles();

    /**
     * 엑셀 변환
     */
    const print = async () => {
      const url = '/api/print/excel/regular';
      const formData = new FormData(); 
      formData.append('documentInfo', JSON.stringify(documentInfo));
      formData.append('issued', JSON.stringify(issued));  
      editable.creId = 'root';
      editable.comment = document.getElementById('comment').value;
      formData.append('editable', JSON.stringify(editable));  

      const config = {
          headers : { 'content-type' : 'multipart/form-data'  },
          proxy: Proxy.ProxyConfig
      }

      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert(`${ExcelInfo.RegularDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
          }else{
            alert(response.data.message);
          }
          onClose();
      });
    }


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
                <CardHeader title="정근상장 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">대상자</TableCell>
                                <TableCell align="left" >{editable.departmentName} {editable.gradeName}  {editable.className} {editable.koreanName}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급일자</TableCell>
                                <TableCell align="left" >{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급번호</TableCell>
                                <TableCell align="left" >{issued.issuedYear}-{issued.documentType}-{issued.seqNo}</TableCell>                   
                            </TableRow>
                            <TableRow>                              
                              <TableCell align="left">상장내용</TableCell>
                                <TableCell align="left">
                                  <TextareaAutosize
                                    name="comment"
                                    id="comment"
                                    rows={4}
                                    rowsMax={10}
                                    defaultValue={DataExtract.findItemValue(documentInfo, 'content')}
                                    aria-label="maximum height"
                                    style={{width:800,height:100}}
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


RegularModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  RegularModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  


export default RegularModal;