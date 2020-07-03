import React, { useState } from 'react';
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
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';
import DataExtract from '../../../../utils/DataExtract';
import Valid from '../../../../utils/Valid';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1200,
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
 * 신규학급 생성 모달 
 * @param {*} param0 
 */
function ClassinfoInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles();
  
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/classinfo/dupl/list?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 신규학급 저장전 유효성 검사
  */ 
 const saveNewClassinfo = async () => {

    let form = document.forms['form']; 

    if(!DataExtract.getSelectedValue( form.semester)){
      alert('학기를 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.department)){
      alert('부서를 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.grade)){
      alert('학년을 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.classNo)){
      alert('반을 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.classType)){
      alert('유형을 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.classTime)){
      alert('시간구분을 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.teacher)){
      alert('담임을 선택하지 않았습니다.'); return;
    }
    if(!DataExtract.getSelectedValue( form.classroom)){
      alert('교실을 선택하지 않았습니다.'); return;
    }  
    if(!form.classCapacity.value){
      alert("정원을 입력하지 않았습니다.");  return;
    }
    
    let query  = 'semesterId='  + DataExtract.getSelectedValue( form.semester); 
        query += '&department=' + DataExtract.getSelectedValue( form.department); 
        query += '&grade='      + DataExtract.getSelectedValue( form.grade); 
        query += '&classNo='    + DataExtract.getSelectedValue( form.classNo); 
        query += '&classType='  + DataExtract.getSelectedValue( form.classType); 
        query += '&classTime='  + DataExtract.getSelectedValue( form.classTime); 
    callApi(query)
    .then(response => {
      if(response.duplCheck[0].RESULT === "Y"){
        save();
      }else{
        alert(`이미 등록된 반입니다.`);
      }
    })
    .catch(err => console.log(err));
 }//saveNewClassinfo

 /**
  * 중복검사 후 신규학급 저장
  */ 
 const save = () => {
  let form = document.forms['form'];
  const url = '/api/classinfo/save';
  const formData = new FormData();  
  const gradeName = DataExtract.getSelectedText( form.grade);
  const classNoName = DataExtract.getSelectedText( form.classNo);

  if(!window.confirm(`${gradeName} ${classNoName} 을 생성하기겠습니까?`)){
    return;
  }

  formData.append('className', `${gradeName} ${classNoName}`);  
  formData.append('semesterId', DataExtract.getSelectedValue( form.semester));  
  formData.append('department', DataExtract.getSelectedValue( form.department));  
  formData.append('grade', DataExtract.getSelectedValue( form.grade));  
  formData.append('classNo', DataExtract.getSelectedValue( form.classNo));  
  formData.append('classType', DataExtract.getSelectedValue( form.classType));  
  formData.append('classTime', DataExtract.getSelectedValue( form.classTime));  
  formData.append('teacherId', DataExtract.getSelectedValue( form.teacher));  
  formData.append('classroomId', DataExtract.getSelectedValue( form.classroom));    
  formData.append('schoolfeeType', DataExtract.getSelectedValue( form.schoolfeeType));  
  formData.append('classStatus', 'NOASSIGN');   //학생미배정 
  formData.append('classCapacity', form.classCapacity.value);
  formData.append('creId', 'root');  
   
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
 }//updateStudentBasicInfo

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
          <CardHeader title="신규 학급 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell>학기</TableCell> 
                  <TableCell>
                    <select
                      name="semester"
                      id="semester"
                      className={classes.selectBox}
                    >       
                      <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="N"/>                
                    </select>
                  </TableCell>
                  <TableCell>부서</TableCell>
                  <TableCell>
                    <select
                      name="department"
                      id="department"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="DEPARTMENT" placeHolder="부서" firstSelectYn="N"/>      
                    </select>
                  </TableCell>
                  <TableCell>학년</TableCell>
                  <TableCell>
                    <select
                      name="grade"
                      id="grade"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="GRADE" placeHolder="학년" firstSelectYn="N"/>    
                    </select>
                  </TableCell>
                  <TableCell>반</TableCell>
                  <TableCell>
                    <select
                      name="classNo"
                      id="classNo"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="CLASS_NO" placeHolder="반" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>
                    <select
                      name="classType"
                      id="classType"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="CLASS_TYPE" placeHolder="유형" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>시간구분</TableCell>
                  <TableCell>
                    <select
                      name="classTime"
                      id="classTime"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="CLASS_TIME" placeHolder="시간구분" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                  <TableCell>담임</TableCell>
                  <TableCell>
                    <select
                      name="teacher"
                      id="teacher"
                      className={classes.selectBox}
                    >                    
                      <SpecialCommonCode specialCode="teacher" placeHolder="담임" firstSelectYn="N"/>   
                    </select>
                  </TableCell>
                  <TableCell>교실</TableCell>
                  <TableCell>
                    <select
                      name="classroom"
                      id="classroom"
                      className={classes.selectBox}
                    >                    
                      <SpecialCommonCode specialCode="classroom" placeHolder="교실" firstSelectYn="N"/>   
                    </select>
                  </TableCell>
                  <TableCell>정원</TableCell>
                  <TableCell>
                    <TextField
                      name="classCapacity"
                      id="classCapacity"
                      variant="outlined"  
                      className={classes.textFieldNum}
                      placeholder="숫자만"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정원')}                
                    />
                  </TableCell>
                  <TableCell>수업료 유형</TableCell>
                  <TableCell>
                    <select
                      name="schoolfeeType"
                      id="schoolfeeType"
                      className={classes.selectBox}
                    >                     
                      <CommonCode superCode="SCHOOLFEE_TYPE" placeHolder="수업료 유형" firstSelectYn="N" />    
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
              onClick={onClose}
              variant="contained">
              닫기
            </Button>
            <Button
              color="primary"
              onClick={saveNewClassinfo}
              variant="contained">
              저장
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

ClassinfoInsertModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  ClassinfoInsertModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default ClassinfoInsertModal;
