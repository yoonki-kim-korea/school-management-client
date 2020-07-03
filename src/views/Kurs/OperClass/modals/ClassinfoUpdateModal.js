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
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';
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
    width: 1300,
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
 * 학급 수정 모달 팝업
 * @param {*}} param0 
 * @param form 수정 대상인 공통코드
 * @param search 수정 성공 후 공통코드 목록 재조회
 */
function ClassinfoUpdateModal({ open, onClose, currentClassinfo, search, className, ...rest }) {
  const classes = useStyles(); 
  
  const callApi = async (query) => {
    const response = await fetch('/api/classinfo/dupl/list?' + query);
    const body = await response.json();
    return body;
  }
  
 /**
  * 학급정보 수정 저장
  */ 
 const updateClassinfo = () => {

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

    let query  = 'semesterId='  + DataExtract.getSelectedValue(form.semester); 
        query += '&department=' + DataExtract.getSelectedValue(form.department); 
        query += '&grade='      + DataExtract.getSelectedValue(form.grade); 
        query += '&classNo='    + DataExtract.getSelectedValue(form.classNo); 
        query += '&classType='  + DataExtract.getSelectedValue(form.classType); 
        query += '&classTime='  + DataExtract.getSelectedValue(form.classTime); 
        query += '&classId='    + currentClassinfo.classId; 

    callApi(query)
    .then(response => {
      console.log(response.duplCheck[0].RESULT)
      if(response.duplCheck[0].RESULT === "Y"){
        save();
      }else{
        alert(`이미 등록된 반입니다.`);
      }
    })
    .catch(err => console.log(err));

 }//updateClassinfo

 /**
  * 중복 검사 후 저장
  */
 const save = () => {
    let form = document.forms['form'];  
    const url = '/api/classinfo/update';
    const formData = new FormData();  
    const gradeName = DataExtract.getSelectedText( form.grade);
    const classNoName = DataExtract.getSelectedText( form.classNo);

    if(!window.confirm(`${gradeName} ${classNoName} 을 수정하기겠습니까?`)){
      return;
    }    

    formData.append('classId', currentClassinfo.classId);  
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
    formData.append('classCapacity', form.classCapacity.value);
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
 }//save

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
          <CardHeader title="기존 학급 수정" />
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
                        <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="N" selectedValue={currentClassinfo.semesterId}/>                
                      </select>
                  </TableCell> 
                  <TableCell>부서</TableCell>
                  <TableCell>
                    <select
                      name="department"
                      id="department"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="DEPARTMENT" selectedValue={currentClassinfo.department} />      
                    </select>
                  </TableCell>
                  <TableCell>학년</TableCell>
                  <TableCell>
                    <select
                      name="grade"
                      id="grade"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="GRADE" selectedValue={currentClassinfo.grade} />     
                    </select>
                  </TableCell>
                  <TableCell>반</TableCell>
                  <TableCell>
                    <select
                      name="classNo"
                      id="classNo"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="CLASS_NO" selectedValue={currentClassinfo.classNo} />      
                    </select>
                  </TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>
                    <select
                      name="classType"
                      id="classType"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="CLASS_TYPE" selectedValue={currentClassinfo.classType} />      
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
                      <CommonCode superCode="CLASS_TIME" selectedValue={currentClassinfo.classTime} />     
                    </select>
                  </TableCell>
                  <TableCell>담임</TableCell>
                  <TableCell>
                    <select
                      name="teacher"
                      id="teacher"
                      className={classes.selectBox}
                    >                    
                      <SpecialCommonCode specialCode="teacher" placeHolder="담임" firstSelectYn="N" selectedValue={currentClassinfo.teacherId}/>   
                    </select>
                  </TableCell>
                  <TableCell>교실</TableCell>
                  <TableCell>
                    <select
                      name="classroom"
                      id="classroom"
                      className={classes.selectBox}
                    >                    
                      <SpecialCommonCode specialCode="classroom" placeHolder="교실" firstSelectYn="N" selectedValue={currentClassinfo.classroomId}/>   
                    </select>
                  </TableCell>
                  <TableCell>정원</TableCell>
                  <TableCell>
                    <TextField
                      name="classCapacity"
                      id="classCapacity"
                      variant="outlined"  
                      className={classes.textFieldNum} 
                      defaultValue={currentClassinfo.classCapacity}               
                    />
                  </TableCell>
                  <TableCell>수업료 유형</TableCell>
                  <TableCell>
                    <select
                      name="schoolfeeType"
                      id="schoolfeeType"
                      className={classes.selectBox}
                    >                    
                      <CommonCode superCode="SCHOOLFEE_TYPE" placeHolder="수업료 유형" firstSelectYn="N"  selectedValue={currentClassinfo.schoolfeeType}/>    
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
              onClick={() => updateClassinfo()}
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

ClassinfoUpdateModal.propTypes = {
    className: PropTypes.string,
    semester: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  ClassinfoUpdateModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default ClassinfoUpdateModal;
