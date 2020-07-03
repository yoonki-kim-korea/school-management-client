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
  TableCell,
  TextareaAutosize
} from '@material-ui/core';

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
function DiaryUpdateModal({ open, onClose, editableDiary, search, className, studentId, ...rest }) {
  const classes = useStyles(); 
  
 /**
  * 메모 수정
  */ 
  const updateMemo = () => {
    let form = document.forms['form'];  
    const url = '/api/diary/update';
    const formData = new FormData();      
    if(!!form.content.value){ 
      formData.append('content', form.content.value);  
    } else{
      formData.append('content', editableDiary.content);
    }     
    formData.append('diaryId', editableDiary.diaryId);
    formData.append('udtId', 'root');  
    formData.append('studentId', studentId);  
    
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
 }//updateMemo

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
          <CardHeader title="기존 메모 수정" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>작성자</TableCell>
                  <TableCell>{editableDiary.creName}</TableCell>
                  <TableCell>작성일시</TableCell>
                  <TableCell>{editableDiary.creDtm}</TableCell>                
                </TableRow>
                <TableRow>
                  <TableCell>내용</TableCell>
                  <TableCell colSpan="3">                   
                    <TextareaAutosize
                      name="content"
                      id="content"
                      rows={4}
                      rowsMax={10}
                      aria-label="maximum height"
                      placeholder={editableDiary.content}
                      style={{width:800,height:250}}
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
              onClick={updateMemo}
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

DiaryUpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  DiaryUpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default DiaryUpdateModal;
