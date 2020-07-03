import React  from 'react';
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
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from '@material-ui/core';
import DataExtract from '../../../../../utils/DataExtract';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1000,
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
 * 학생별 메모 수정 모달
 * @param {*} param0 
 */
function UpdateModal({ open, onClose, editable, search, className, teacherId, ...rest }) {
  const classes = useStyles(); 
  console.log(editable.contactId)
  
 /**
  * 메모 수정
  */ 
  const updateContact = () => {
    let form = document.forms['form'];  
    const url = '/api/teacher/contact/update';
    const formData = new FormData();      
    formData.append('contactStartDate', DataExtract.getDateString(form.contactStartDate.value));  
    formData.append('contactEndDate', DataExtract.getDateString(form.contactEndDate.value));  
    formData.append('realEndDate', DataExtract.getDateString(form.realEndDate.value));
    formData.append('contactId', editable.contactId);
    formData.append('udtId', 'root');  
    formData.append('teacherId', teacherId);  
    
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
 }//updateContact

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
          <CardHeader title="기존 계약 수정" />
          <Divider />
          <CardContent>
            <Table>
            <TableBody>
                <TableRow>
                  <TableCell>계약시작일자</TableCell>
                  <TableCell>
                    <TextField
                      id="contactStartDate"
                      name="contactStartDate"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(editable.contactStartDate, '-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />    
                  </TableCell>
                  <TableCell>계약종료일자</TableCell>
                  <TableCell>
                    <TextField
                      id="contactEndDate"
                      name="contactEndDate"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(editable.contactEndDate, '-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />    
                  </TableCell>
                  <TableCell>실제종료일자</TableCell>
                  <TableCell>
                    <TextField
                      id="realEndDate"
                      name="realEndDate"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(editable.realEndDate, '-')}
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
              onClick={updateContact}
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

UpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default UpdateModal;
