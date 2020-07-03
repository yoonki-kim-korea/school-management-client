import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../utils/Proxy';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,  
  TextareaAutosize
} from '@material-ui/core';
import Valid from '../../../utils/Valid';
import DataExtract from '../../../utils/DataExtract';
import CommonCode from '../../../utils/CommonCode';

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
    width:110,
  },
  textLong:{
    width:800
  }
}));

function InsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/document/dupl?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 저장 및 중복검사
  */ 
 const saveNewSuperCode = () => {
  let form = document.forms['form'];
  
  if(!DataExtract.getSelectedValue(form.documentId)) {
    alert('문서를 입력하지 않았습니다.');
    return;
  };  

  if(!form.itemId.value) {
    alert('항목ID를 입력하지 않았습니다.');
    return;
  };  

  let query  = 'documentId=' + form.documentId.value;  
      query += '&itemId=' + form.itemId.value;

  callApi(query)
  .then(response => {
    console.log(response.duplCheck[0].RESULT)
    if(response.duplCheck[0].RESULT === "Y"){
      save();
    }else{
      alert(`이미 등록되어 있는 항목입니다.`);
    }
  })
  .catch(err => console.log(err));
 }//saveNewSuperCode

 /**
  * 중복검사후 항목 저장
  */
 const save = async () => { 
  let form = document.forms['form'];  
  const url = '/api/document/save';
  const formData = new FormData();
  formData.append('documentId', DataExtract.getSelectedValue(form.documentId));  
  formData.append('itemId', form.itemId.value);  
  formData.append('itemName', form.itemName.value);  
  formData.append('itemValue', form.itemValue.value);  
  formData.append('creId', 'root');  
  
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }

  post(url, formData, config, Response)
  .then(response =>{
    if(response.data.result === "success"){
      alert('저장 성공');
      search(DataExtract.getSelectedValue(form.documentId));
      onClose();
    }else{
      alert('저장 실패');
      onClose();
    }
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
          <CardHeader title="신규 항목 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>문서</TableCell>
                  <TableCell>
                    <select id="documentId" name="documentId" className={classes.selectBox}>
                      <CommonCode superCode="DOCUMENT" firstSelectYn="N" placeHolder="문서"/>
                    </select>
                  </TableCell>
                  <TableCell>항목ID</TableCell>
                  <TableCell>
                    <TextField
                      name="itemId"
                      id="itemId"
                      variant="outlined"
                      placeholder="최대 30자"
                      onChange={(event) => Valid.maxLength(event, 30, '항목ID')}
                    />
                  </TableCell>
                  <TableCell>항목명</TableCell>
                  <TableCell>
                    <TextField
                      name="itemName"
                      id="itemName"
                      variant="outlined"
                      placeholder="최대 45자"
                      onChange={(event) => Valid.maxLength(event, 45, '항목명')}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>항목값</TableCell>
                  <TableCell colSpan="5">
                    <TextareaAutosize
                      name="itemValue"
                      id="itemValue"
                      rows={4}
                      rowsMax={10}
                      aria-label="maximum height"
                      placeholder="최대 1000자"
                      //defaultValue={comment}
                      style={{width:800,height:150}}
                      onChange={(event) => Valid.maxLength(event, 1000, '항목값')}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
          </CardContent>
          <Divider />
          <CardActions className={classes.actions}>
            <Button 
              color="primary"
              variant="contained"
              onClick={onClose}>
              닫기
            </Button>
            <Button
              color="primary"
              onClick={saveNewSuperCode}
              variant="contained"
            >
              저장
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

InsertModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  InsertModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default InsertModal;
