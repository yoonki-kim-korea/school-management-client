import React  from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../utils/Proxy';
import Valid       from '../../../utils/Valid';
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
 * 공통코드 수정 모달 팝업
 * @param {*}} param0 
 * @param editableCode 수정 대상인 공통코드
 * @param search 수정 성공 후 공통코드 목록 재조회
 */
function CodeUpdateModal({ open, onSaveAndClose, onClose, editableCode, search, className, ...rest }) {
  const classes = useStyles(); 

  const callApi = async (query) => {
    const response = await fetch('/api/codem/dupl/list?' + query);
    const body = await response.json();
    return body;
  }
  
 /**
  * 공통코드 수정 저장
  */ 
 const saveNewCode = (editableCode) => {
  let form = document.forms['form'];  
  if(!!form.code.value){ 
    let query  = 'code='      + form.code.value + '&';
        query += 'superCode=' + editableCode.superCode;  
        query += 'codeId='    + editableCode.codeId;  
    callApi(query)
    .then(response => {
      console.log(response.duplCheck[0].RESULT)
      if(response.duplCheck[0].RESULT === "Y"){
        save(editableCode);
      }else{
        alert(`코드값이 이미 등록되어 있습니다.`);
      }
    })
    .catch(err => console.log(err));
  }else{
    save(editableCode);
  }
 }//saveNewCode

 const save = async (editableCode) => {

  let form = document.forms['form'];  
  const url = '/api/codem/code/update';
  const formData = new FormData();
  
  if(!!form.code.value){ 
    formData.append('code', form.code.value);
  }else{
    formData.append('code', editableCode.code);
  }  
  
  if(!!form.codeName.value){ 
    formData.append('codeName', form.codeName.value);  
  } else{
    formData.append('codeName', editableCode.codeName);
  }
  
  if(!!form.wellOrder.value){ 
    formData.append('wellOrder', form.wellOrder.value);  
  }else{
    formData.append('wellOrder', editableCode.wellOrder);
  } 
  formData.append('udpId', 'root');  
  formData.append('codeId', editableCode.codeId);  
  formData.append('superCodeId', editableCode.superCodeId);  
  formData.append('superCode', editableCode.superCode);  
   
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }
  
  post(url, formData, config, Response)
  .then(response => {
      if(response.data.result === "success"){            
        alert('저장 성공');
        search();
        onClose();
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
          <CardHeader title="기존 코드 수정" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>슈퍼코드</TableCell>
                  <TableCell>{editableCode.superCode}</TableCell>
                  <TableCell>슈퍼코드명</TableCell>
                  <TableCell colSpan="4">{editableCode.superCodeName}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>코드</TableCell>
                  <TableCell>
                    <TextField
                      name="code"
                      id="code"
                      variant="outlined"                
                      defaultValue={editableCode.code}
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
                      defaultValue={editableCode.codeName}
                      placeholder="최대 45자"
                      onChange={(event) => Valid.maxLength(event, 45, '코드')}
                    />
                  </TableCell>
                  <TableCell>정렬순서</TableCell>
                  <TableCell>
                    <TextField
                      name="wellOrder"
                      id="wellOrder"
                      variant="outlined"
                      defaultValue={editableCode.wellOrder}
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
              variant="contained">
              닫기
            </Button>
            <Button
              color="primary"
              onClick={() => saveNewCode(editableCode)}
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

CodeUpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  CodeUpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default CodeUpdateModal;
