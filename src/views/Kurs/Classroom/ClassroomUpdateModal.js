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
 * 교실 수정 모달
 * @param {*} param0 
 */
function SemesterUpdateModal({ open, onClose, currentClassroom, search, className, ...rest }) {
  const classes = useStyles(); 
  
 /**
  * 교실 수정 저장
  */
 const updateClassroom = () => {
  let form2 = document.forms['form2'];  
  const url = '/api/classroom/update';
  const formData = new FormData();
  formData.append('classroomId', currentClassroom.classroomId);  
  formData.append('classroomName', form2.classroomName.value);  
  formData.append('positionDesc', form2.positionDesc.value);  
  formData.append('capacity', form2.capacity.value);  
  formData.append('udtId', "root");
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
 }//updateClassroom

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="form2">
          <CardHeader title="기존 교실 수정" />
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
                      defaultValue={currentClassroom.classroomName}    
                      className={classes.textField}          
                    />
                  </TableCell>
                  <TableCell>위치정보상세</TableCell>
                  <TableCell>
                    <TextField
                      name="positionDesc"
                      id="positionDesc"
                      variant="outlined"  
                      defaultValue={currentClassroom.positionDesc} 
                      className={classes.textFieldWid}                
                    />
                  </TableCell>
                  <TableCell>정원</TableCell>
                  <TableCell>
                    <TextField
                      name="capacity"
                      id="capacity"
                      variant="outlined"  
                      defaultValue={currentClassroom.capacity} 
                      className={classes.textFieldNum}                
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
              onClick={() => updateClassroom()}
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

SemesterUpdateModal.propTypes = {
    className: PropTypes.string,
    semester: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  SemesterUpdateModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default SemesterUpdateModal;
