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
import CommonCode from '../../../utils/CommonCode';
import DataExtract from '../../../utils/DataExtract';
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
  },
  selectBox:{
    height: 42,
    width:120,
  },
}));

/**
 * 사용자 추가 모달 팝업
 * @param {*} param0 
 * @param newUserId 사용자 추가할 때의 슈퍼코드의 ID
 * @param newUserName 사용자 추가할 때의 슈퍼코드의 이름
 * @param search 사용자 추가 후 부모창의 목록 재조회
 */
function UserInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

  const callApi = async (query) => {
    const response = await fetch('/api/user/valid?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 사용자 신규 저장
  */ 
 const saveNewCode = async () => {

    let form = document.forms['form'];
    let query = 'userId='+ form.userId.value;
    callApi(query)
    .then(response => {
      if(response.duplCheck[0].RESULT === "Y"){
        save();
        onClose();
      }else{
        alert(`사용자ID가 이미 등록되어 있습니다.`);
      }
    })
    .catch(err => console.log(err));
 }//updateStudentBasicInfo

 const save = () =>{    
    let form = document.forms['form'];  
    const formData = new FormData();
    if(!form.userId.value) {
        alert('사용자를 입력하지 않았습니다.');
        return;
    };
    if(!form.userName.value) {
        alert('사용자명을 입력하지 않았습니다.');
        return;
    }     
    formData.append('userId', form.userId.value);  
    formData.append('userName', form.userName.value);  
    formData.append('userPw', form.userPw.value);  
    formData.append('authCd', DataExtract.getSelectedValue(form.auth));  
    formData.append('creId', 'root');     
    const url = '/api/user/save';
    const config = {
          headers : { 'content-type' : 'multipart/form-data' },
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
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="form">
          <CardHeader title="신규 사용자 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>사용자ID</TableCell>
                  <TableCell>사용자명</TableCell>
                  <TableCell>권한</TableCell>
                  <TableCell>비밀번호</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TextField
                      name="userId"
                      id="userId"
                      variant="outlined"
                      placeholder="10자이내"
                      onChange={(event) => Valid.maxLength(event, 10, '사용자ID')}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="userName"
                      id="userName"
                      variant="outlined"
                      placeholder="12자이내"
                      onChange={(event) => Valid.maxLength(event, 12, '사용자명')}
                    />
                  </TableCell>
                  <TableCell>
                    <select id="auch" name="auth" className={classes.selectBox}>
                     <CommonCode superCode="USER_AUTH_CD" firstSelectYn="N" />
                    </select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="userPw"
                      id="userPw"
                      variant="outlined"
                      placeholder="12자이내"
                      onChange={(event) => Valid.maxLength(event, 12, '비밀번호')}
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

UserInsertModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UserInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
  };  

export default UserInsertModal;
