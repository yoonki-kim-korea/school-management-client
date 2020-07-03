import React  from 'react';
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
import DataExtract from '../../../../utils/DataExtract';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 400,
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
  textFieldNum:{
    width:80
  }
}));

/**
 * 학급 폐강 모달 팝업
 * @param {*}} param0 
 * @param currentClassinfoForm 수정 대상인 공통코드
 * @param search 수정 성공 후 공통코드 목록 재조회
 */
function ClassinfoCancelModal({ open, onClose, currentClassinfo, search, className, ...rest }) {
  const classes = useStyles(); 
  
 /**
  * 학급 폐강
  */ 
 const cancelClassinfo = () => {

  let currentClassinfoForm = document.forms['currentClassinfoForm'];  
  const url = '/api/classinfo/cancel';
  const formData = new FormData();
  
  if(!window.confirm(`${currentClassinfo.semesterName} ${currentClassinfo.departmentName} ${currentClassinfo.className} 을 폐강하기겠습니까?`)){
    return;
  }

  formData.append('classId', currentClassinfo.classId);  
  formData.append('cancelReason', DataExtract.getSelectedValue( currentClassinfoForm.cancelReason));  
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
 }//cancelClassinfo

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="currentClassinfoForm">
          <CardHeader title="폐강" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>폐강사유</TableCell>
                  <TableCell>
                    <select
                      name="cancelReason"
                      id="cancelReason"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="CANCEL_REASON" firstSelectYn="N" placeHolder="폐강사유"/>      
                    </select>
                  </TableCell>
                </TableRow>    
              </TableBody>
            </Table>            
          </CardContent>
          <Divider />
          <CardActions className={classes.actions}>
            <Button color="primary"
                    variant="contained"
                    onClick={onClose}>
              닫기
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => cancelClassinfo()}
            >
              폐강
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

ClassinfoCancelModal.propTypes = {
    className: PropTypes.string,
    semester: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  ClassinfoCancelModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default ClassinfoCancelModal;
