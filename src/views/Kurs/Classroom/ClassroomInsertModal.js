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
  },
  textField:{
    width:200
  },
  textFieldWid:{
    width:500
  },
  textFieldNum:{
    width:80
  }
}));

/**
 * 교실 추가 모달
 * @param {*} param0 
 */
function ClassroomInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

 /**
  * 교실 신규 저장
  */ 
 const saveNewClassroom = () => {

  let form = document.forms['form'];  
  const url = '/api/classroom/save';
  const formData = new FormData();  

  if(!form.classroomName.value){
    alert("교실명을 입력하지 않았습니다.");
    return;
  }

  formData.append('classroomName', form.classroomName.value);  
  formData.append('positionDesc', form.positionDesc.value);  
  formData.append('capacity', form.capacity.value);  
  formData.append('creId', 'root');  
   
  const config = {
      headers : { 'content-type' : 'multipart/form-data'  },
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
 }//saveNewClassroom

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
          <CardHeader title="신규 교실 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell>교실명</TableCell> 
                  <TableCell>
                    <TextField
                      name="classroomName"
                      id="classroomName"
                      variant="outlined"    
                      className={classes.textField}  
                      placeholder="20자 이내"
                      onChange={(event) => Valid.maxLength(event, 20, '교실명')}            
                    />
                  </TableCell>
                  <TableCell>위치정보상세</TableCell>
                  <TableCell>
                    <TextField
                      name="positionDesc"
                      id="positionDesc"
                      variant="outlined"  
                      className={classes.textFieldWid}   
                      placeholder="200자 이내" 
                      onChange={(event) => Valid.maxLength(event, 200, '위치정보상세')}                 
                    />
                  </TableCell>
                  <TableCell>정원</TableCell>
                  <TableCell>
                    <TextField
                      name="capacity"
                      id="capacity"
                      variant="outlined"  
                      className={classes.textFieldNum}
                      placeholder="숫자만 입력"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정원')}                
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
          </CardContent>
          <Divider />
          <CardActions className={classes.actions}>
            <Button onClick={onClose}
              color="primary"
              variant="contained">
              닫기
            </Button>
            <Button
              color="primary"
              onClick={saveNewClassroom}
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

ClassroomInsertModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  ClassroomInsertModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default ClassroomInsertModal;
