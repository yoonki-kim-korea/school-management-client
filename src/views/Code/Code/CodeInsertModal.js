import React, { useState } from 'react';
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

/**
 * 공통코드 추가 모달 팝업
 * @param {*} param0 
 * @param newSuperCodeId 공통코드 추가할 때의 슈퍼코드의 ID
 * @param newSuperCodeName 공통코드 추가할 때의 슈퍼코드의 이름
 * @param search 공통코드 추가 후 부모창의 목록 재조회
 */
function CodeInsertModal({ newSuperCodeId, newSuperCodeName, open, search, onSaveAndClose, onClose, className, ...rest }) {
  const classes = useStyles(); 
  let newSuperCode = '';
  if(!!newSuperCodeName){
    newSuperCode = newSuperCodeName.split('] ')[0].replace('[', '');
    newSuperCodeName = newSuperCodeName.split('] ')[1];
  }else{
    newSuperCodeName = '';
  }

  const callApi = async (query) => {
    const response = await fetch('/api/codem/dupl/list?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 공통코드 신규 저장
  */ 
 const saveNewCode = async () => {

    let form = document.forms['form'];
    let query = 'code='       + form.code.value + '&';
        query += 'superCode=' + newSuperCode;  
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
 }//updateStudentBasicInfo

 const save = async () =>{    
    let form = document.forms['form'];  
    const formData = new FormData();
    if(!form.code.value) {
        alert('코드를 입력하지 않았습니다.');
        return;
    };
    if(!form.codeName.value) {
        alert('코드명을 입력하지 않았습니다.');
        return;
    }
    formData.append('superCodeId', newSuperCodeId);  
    formData.append('superCode', newSuperCode);  
    formData.append('code', form.code.value);  
    formData.append('codeName', form.codeName.value);  
    formData.append('wellOrder', form.wellOrder.value);  
    formData.append('creId', 'root');     
    const url = '/api/codem/code/save';
    const config = {
          headers : {
              'content-type' : 'multipart/form-data'
          },
          proxy: Proxy.ProxyConfig
    }
    post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert('저장 성공');
            search();
            onSaveAndClose();
          }else{
            alert('저장 실패');
          }
    });
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
          <CardHeader title="신규 슈퍼코드 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell>슈퍼코드</TableCell>
                  <TableCell>{newSuperCode}</TableCell>
                  <TableCell>슈퍼코드명</TableCell>
                  <TableCell colSpan="4">{newSuperCodeName}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>코드</TableCell>
                  <TableCell>
                    <TextField
                      name="code"
                      id="code"
                      variant="outlined"
                      placeholder="최대 20자"
                      onChange={(event) => Valid.maxLength(event, 20, '코드')}
                    />
                  </TableCell>
                  <TableCell>코드명</TableCell>
                  <TableCell>
                    <TextField
                      name="codeName"
                      id="codeName"
                      variant="outlined"
                      placeholder="최대 45자"
                      onChange={(event) => Valid.maxLength(event, 45, '코드명')}
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
              onClick={onClose}
              variant="contained"
            >
              닫기
            </Button>
            <Button
              color="primary"
              onClick={saveNewCode}
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

CodeInsertModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  CodeInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default CodeInsertModal;
