import React  from 'react';
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
import DataExtract from '../../../utils/DataExtract';
import CommonCode from '../../../utils/CommonCode';
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
 * 공통코드 수정 모달 팝업
 * @param {*}} param0 
 * @param editableUser 수정 대상인 공통코드
 * @param search 수정 성공 후 공통코드 목록 재조회
 */
function UserUpdateModal({ open, onClose, editableUser, search, className, ...rest }) {
  const classes = useStyles(); 
  
 /**
  * 공통코드 수정 저장
  */ 
  const saveNewUser = (editableUser) => {
    let form = document.forms['form'];  
    const url = '/api/user/update';
    const formData = new FormData(); 
    formData.append('userName', form.userName.value);  
    formData.append('userPw', form.userPw.value);    
    formData.append('authCd', DataExtract.getSelectedValue(form.auth));  
    formData.append('udtId', 'root');  
    formData.append('userId', editableUser.userId);  
    
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
 }//saveNewUser

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
          <CardHeader title="기존 사용자 수정" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>사용자ID</TableCell>
                  <TableCell>{editableUser.userId}</TableCell>
                  <TableCell>사용자명</TableCell>
                  <TableCell>
                    <TextField
                      name="userName"
                      id="userName"
                      variant="outlined"                      
                      defaultValue={editableUser.userName}
                      placeholder="12자이내"
                      onChange={(event) => Valid.maxLength(event, 12, '사용자명')}
                    />
                  </TableCell>
                  <TableCell>비밀번호</TableCell>
                  <TableCell>
                    <TextField
                      name="userPw"
                      id="userPw"
                      variant="outlined"
                      defaultValue={editableUser.userPw}
                      placeholder="12자이내"
                      onChange={(event) => Valid.maxLength(event, 12, '비밀번호')}
                    />
                  </TableCell>
                  <TableCell>권한</TableCell>
                  <TableCell>
                    <select id="auch" name="auth" className={classes.selectBox}>
                     <CommonCode superCode="USER_AUTH_CD" firstSelectYn="Y" selectedValue={editableUser.authCd}/>
                    </select>
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
              onClick={() => saveNewUser(editableUser)}
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

UserUpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UserUpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
  };  

export default UserUpdateModal;
