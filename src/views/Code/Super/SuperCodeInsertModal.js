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
  TableCell
} from '@material-ui/core';
import Valid from '../../../utils/Valid';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1300,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

function SuperCodeInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

  const callApi = async (query) => {
    const response = await fetch('/api/codem/super/dupl/list?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 저장
  */ 
 const saveNewSuperCode = () => {
  let form = document.forms['form'];
  let query = 'superCode=' + form.superCode.value;  
  callApi(query)
  .then(response => {
    console.log(response.duplCheck[0].RESULT)
    if(response.duplCheck[0].RESULT === "Y"){
      save();
    }else{
      alert(`코드값이 이미 등록되어 있습니다.`);
    }
  })
  .catch(err => console.log(err));
 }//saveNewSuperCode

 const save = async () => { 
  let form = document.forms['form'];  
  const url = '/api/codem/super/save';
  const formData = new FormData();
  if(!form.superCode.value) {
      alert('슈퍼코드를 입력하지 않았습니다.');
      return;
  };
  if(!form.superCodeName.value) {
      alert('슈퍼코드명을 입력하지 않았습니다.');
      return;
  }
  formData.append('superCode', form.superCode.value);  
  formData.append('superCodeName', form.superCodeName.value);  
  formData.append('wellOrder', form.wellOrder.value);  
  formData.append('creId', 'root');  
  
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }

  post(url, formData, config, Response)
  .then(response =>{
    if(response.data.result === "success"){
      alert('저장 성공');
      search(form.superCode.value);
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
          <CardHeader title="신규 슈퍼코드 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell>슈퍼코드</TableCell>
                  <TableCell>
                    <TextField
                      name="superCode"
                      id="superCode"
                      variant="outlined"
                      placeholder="최대 20자"
                      onChange={(event) => Valid.maxLength(event, 20, '슈퍼코드')}
                    />
                  </TableCell>
                  <TableCell>슈퍼코드명</TableCell>
                  <TableCell>
                    <TextField
                      name="superCodeName"
                      id="superCodeName"
                      variant="outlined"
                      placeholder="최대 45자"
                      onChange={(event) => Valid.maxLength(event, 45, '슈퍼코드명')}
                    />
                  </TableCell>
                  <TableCell>정렬순서</TableCell>
                  <TableCell>
                    <TextField
                      name="wellOrder"
                      id="wellOrder"
                      variant="outlined"
                      placeholder="숫자만 입력"
                      onChange={(event) => Valid.onlyNumber(event, 3, '정렬순서')}
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

SuperCodeInsertModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  SuperCodeInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default SuperCodeInsertModal;
