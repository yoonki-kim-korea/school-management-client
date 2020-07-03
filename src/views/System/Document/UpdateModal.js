import React  from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
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
  TableCell,  
  TextareaAutosize
} from '@material-ui/core';
import CommonCode from '../../../utils/CommonCode';
import Proxy       from '../../../utils/Proxy';
import Valid from '../../../utils/Valid';

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
  textLong:{
    width:800
  }
}));

function UpdateModal({ open, onClose, editable, search, className, ...rest }) {
  const classes = useStyles();
  
  /**
   * 수정할 항목 저장
   */
  const save = () => {

    let form = document.forms['form'];
    const url = '/api/document/update';
    const formData = new FormData();
    
    formData.append('documentId', editable.documentId);
    formData.append('itemId', editable.itemId);
    formData.append('itemName', editable.itemName);
    formData.append('itemValue', form.itemValue.value);
    formData.append('udpId', 'root');
   
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
          <CardHeader title="기존 항목 수정" />
          <Divider />
          <CardContent>
          <Table>
              <TableBody>
                <TableRow>
                  <TableCell>문서</TableCell>
                  <TableCell>{editable.documentName}</TableCell>
                  <TableCell>항목ID</TableCell>
                  <TableCell>{editable.itemId}</TableCell>
                  <TableCell>항목명</TableCell>
                  <TableCell>{editable.itemName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>항목값</TableCell>
                  <TableCell colSpan="5">
                    <TextareaAutosize
                      name="itemValue"
                      id="itemValue"
                      rows={4}
                      rowsMax={10}
                      aria-label="maximum height"
                      placeholder="최대 1000자"
                      defaultValue={editable.itemValue}
                      style={{width:800,height:150}}
                      onChange={(event) => Valid.maxLength(event, 1000, '항목값')}
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
              variant="contained">
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
    document: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UpdateModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default UpdateModal;
