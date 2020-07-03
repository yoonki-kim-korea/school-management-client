import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../utils/Proxy';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 800,
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
 * 일괄입력 처리 모달
 * @param {*} param0 
 */
function BatchPaymentModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles();  

  //일괄입금 처리
 const save = async () => { 
  let form = document.forms['form'];  
  const url = '/api/payment/batch/save';
  const formData = new FormData();
  if(!form.applyYear.value) {
      alert('적용연도를 입력하지 않았습니다.');
      return;
  }
  if(!form.applyMonth.value) {
      alert('적용월을 입력하지 않았습니다.');
      return;
  }
  if(!form.semesterId.value) {
      alert('학기를 입력하지 않았습니다.');
      return;
  }

  if(!window.confirm('일괄 입금처리하시겠습니까? 일괄 입금처리 후에는 반드시 실제 입금여부를 확인하여 입력해야 합니다. 또한 해당 월에 입금된 정보들 또한 일괄입금으로 변경됩니다.')){
      return ;
  }
  formData.append('applyYear', form.applyYear.value);  
  formData.append('applyMonth', form.applyMonth.value); 
  formData.append('semesterId', form.semesterId.value); 
  formData.append('creId', 'root');  
  
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }

  post(url, formData, config, Response)
  .then(response =>{
    if(response.data.result === "success"){
      alert('저장 성공');
      search();
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
          <CardHeader title="일괄 입금처리" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell>적용연도</TableCell>
                  <TableCell>
                    <select id="applyYear" name="applyYear" className={classes.selectBox}>
                        <CommonCode superCode="SEMESTER_YEAR" firstSelectYn="N" placeHolder="적용연도"/>
                    </select>
                  </TableCell>
                  <TableCell>적용월</TableCell>
                  <TableCell>
                    <select id="applyMonth" name="applyMonth" className={classes.selectBox}>
                        <CommonCode superCode="MONTH" firstSelectYn="N" placeHolder="적용연도"/>
                    </select>
                  </TableCell>
                  <TableCell>적용 학기</TableCell>
                  <TableCell>                      
                    <select name="semesterId"
                            id="semesterId"
                            className={classes.selectBox}
                    >       
                        <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="Y"/>                
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
              onClick={onClose}
            >
              닫기
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={save}
            >
              저장
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

BatchPaymentModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  BatchPaymentModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default BatchPaymentModal;
