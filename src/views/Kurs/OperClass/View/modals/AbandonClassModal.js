import React from 'react';
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
    width: 400,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  selectBox:{
    height: 42,
    width:150,
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

/**
 * 수강중단 처리 모달
 * @param {*} param0 
 */
function AbandonClassModal({ open, onClose, student, search, className, ...rest }) {
  const classes = useStyles();
  
  /**
   * 수강중단 저장
   */
  const save = () => {

    let form = document.forms['form'];  
    let endDate = DataExtract.getDateString(form.endDate.value);
    if(endDate < student.startDate){
      alert("선택한 종료일이 학급시작일 이전입니다.");
      return;
    }
    if(endDate > student.endDate){
      alert("선택한 종료일이 학급종료일 이후입니다.");
      return;
    }
    
    /*if(!form.abandonReason.value){
      alert('수강중단사유를 선택하지 않았습니다.');
      return;
    }*/
    const url = '/api/operclass/student/abandon/update ';
    const formData = new FormData();  
    formData.append('udtId', 'root');  
    formData.append('studentId', student.studentId);  
    formData.append('classId', student.classId); 
    //학생 재배정 및 관리에서 수업중단사유는 모두 기타로 한다.
    formData.append('abandonReason', 'ETC'); //form.abandonReason.value);  
    formData.append('endDate', endDate);  
    
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
          <CardHeader title="수강중단 처리" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                {/**
                <TableRow>
                  <TableCell>수강중단사유</TableCell>
                  <TableCell>
                    <select name="abandonReason"
                            id="abandonReason"
                            className={classes.selectBox}>
                       <CommonCode superCode="ABANDON_REASON" placeHolder="수강중단사유" firstSelectYn="Y" />      
                    </select>
                  </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>수강중단일자</TableCell>
                  <TableCell>
                    <TextField
                        id="endDate"
                        name="endDate"
                        type="date"
                        defaultValue={DataExtract.today("-")}
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

AbandonClassModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  AbandonClassModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default AbandonClassModal;
