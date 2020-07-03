import React  from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../utils/Proxy';
import Valid from '../../../utils/Valid';
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

function SuperCodeUpdateModal({ open, onSaveAndClose, onClose, editableSuperCode, search, className, ...rest }) {
  const classes = useStyles();

  const callApi = async (query) => {
    const response = await fetch('/api/codem/super/dupl/list?' + query);
    const body = await response.json();
    return body;
  } 
  
 /**
  * 저장
  */ 
 const saveNewSuperCode = (editableSuperCode) => {
    let form = document.forms['form'];  
    if(!!form.superCode.value){ 
        let query = 'superCode=' + form.superCode.value;  
            query += '&superCodeId=' + editableSuperCode.superCodeId;
            console.log(query);
        callApi(query)
        .then(response => {
          console.log(response.duplCheck[0].RESULT)
          if(response.duplCheck[0].RESULT === "Y"){
            save(editableSuperCode);
          }else{
            alert(`코드값이 이미 등록되어 있습니다.`);
          }
        })
        .catch(err => console.log(err));
    }else{
        save(editableSuperCode);
    }   
 }//saveNewSuperCode

 const save = (editableSuperCode) => {

  let form = document.forms['form'];  
  const url = '/api/codem/super/update';
  const formData = new FormData();
  
  if(!!form.superCode.value){ 
    formData.append('superCode', form.superCode.value);
  }else{
    formData.append('superCode', editableSuperCode.superCode);
  }  
  
  if(!!form.superCodeName.value){ 
    formData.append('superCodeName', form.superCodeName.value);  
  } else{
    formData.append('superCodeName', editableSuperCode.superCodeName);
  }
  
  if(!!form.wellOrder.value){ 
    formData.append('wellOrder', form.wellOrder.value);  
  }else{
    formData.append('wellOrder', editableSuperCode.wellOrder);
  } 
  formData.append('udpId', 'root');  
  formData.append('superCodeId', editableSuperCode.superCodeId);  
   
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }
  
  post(url, formData, config, Response)
  .then(response => {
      if(response.data.result === "success"){            
        alert('저장 성공');
        search();
      }else{
        alert('저장 실패');
      }
  });
  onSaveAndClose();
 }

  return (
    <Modal
      onSaveAndClose={onSaveAndClose}
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="form">
          <CardHeader title="기존 슈퍼코드 수정" />
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
                      defaultValue={editableSuperCode.superCode}
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
                      defaultValue={editableSuperCode.superCodeName}
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
                      defaultValue={editableSuperCode.wellOrder}
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
              onClick={() => saveNewSuperCode(editableSuperCode)}
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

SuperCodeUpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  SuperCodeUpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default SuperCodeUpdateModal;
