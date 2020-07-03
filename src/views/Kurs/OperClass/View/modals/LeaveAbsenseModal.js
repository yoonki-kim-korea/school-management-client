import React, { useState } from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../../utils/Proxy';
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
import CommonCode from '../../../../../utils/CommonCode';
import DataExtract from '../../../../../utils/DataExtract';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 500,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  selectBox:{
    height: 42,
    width:120,
  },
  actions: {
    justifyContent: 'flex-end'
  },
  dateField: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const initialValues = {
  inputDate: '9999-12-31'
};

/**
 * 휴학 처리 모달
 * @param {*} param0 
 */
function LeaveAbsenseModal({ open, onClose, editable,  search, className, ...rest }) {
  const classes = useStyles();
  const [values, setValues] = useState({ ...initialValues });
  
  /**
   * 휴학 저장
   */
  const save = () => {
    let form = document.forms['form'];  
    if(!form.leaveAbsense.value){
      alert('휴학사유를 선택하지 않았습니다.');
      return;
    }
    const url = '/api/operclass/student/leave/update';
    const formData = new FormData();  
    formData.append('udtId', 'root');  
    formData.append('studentId', editable.studentId);  
    formData.append('classId', editable.classId);  
    formData.append('leaveAbsense', form.leaveAbsense.value);  
    formData.append('inputDate', DataExtract.getDateString(form.inputDate.value));  
    
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
    onClose();
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
          <CardHeader title="휴학 처리" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                    <TableCell align="left">대상자</TableCell>
                    <TableCell align="left" >{editable.departmentName} {editable.gradeName}  {editable.className} {editable.koreanName}</TableCell>                   
                </TableRow>
                <TableRow>
                  <TableCell>휴학사유</TableCell>
                  <TableCell>
                    <select name="leaveAbsense"
                            id="leaveAbsense"
                            className={classes.selectBox}>
                       <CommonCode superCode="LEAVE_ABSENSE" placeHolder="휴학사유" firstSelectYn="Y" />      
                    </select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>휴학일자</TableCell>
                  <TableCell>                    
                    <TextField
                      id="inputDate"
                      name="inputDate"
                      type="date"
                      defaultValue=""
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
              onClick={() => save()}
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

LeaveAbsenseModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  LeaveAbsenseModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default LeaveAbsenseModal;
