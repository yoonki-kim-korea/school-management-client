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
import DataExtract from '../../../../utils/DataExtract';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

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
 * 학생별 메모 저장 모달
 * @param {*} param0 
 */
function DiaryInsertModal({ open, search, onClose, className, studentId, ...rest }) {
  const classes = useStyles(); 

 /**
  * 메모 저장
  */ 
 const saveMomo = () => {
    let form = document.forms['form'];  
    const formData = new FormData();
    if(!form.content.value) {
        alert('내용을 입력하지 않았습니다.');
        return;
    } 
    formData.append('content', form.content.value);  
    formData.append('studentId', studentId);  
    formData.append('creId', 'root');     
    const url = '/api/diary/save';
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
  }//saveMomo

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
          <CardHeader title="신규 메모 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>작성자</TableCell>
                  <TableCell>root</TableCell>
                  <TableCell>작성일시</TableCell>
                  <TableCell>{DataExtract.today()}</TableCell>
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
                      placeholder="최대 200자 이내"
                      style={{width:800,height:300}}
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
              onClick={saveMomo}
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

DiaryInsertModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  DiaryInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
  };  

export default DiaryInsertModal;
