import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import TeacherNo     from '../../../../utils/TeacherNo';
import CommonCode  from '../../../../utils/CommonCode';
import Valid       from '../../../../utils/Valid';
import Proxy       from '../../../../utils/Proxy';
import DataExtract from '../../../../utils/DataExtract';
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

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1500,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  dateField: {
    '& + &': {
      width: 90,
      marginLeft: theme.spacing(2)
    }
  },
  selectBox1 : {
    width : 80,
    height: 40,
    display: 'inline-block',
    alignItems: 'left',
    marginLeft: theme.spacing(2)
  },
  plz: {
    width:90,

  },
  address: {
    width:600
  }
}));

function BasicInfoEditModal({ open, onSaveAndClose, onClose, teacher, className, ...rest }) {
  const classes = useStyles();
 
  /**
   * 연도에 따른 유효한 학번일련번호를 조회한다.
   */
  const teacherNoValidCheck = () => {
    let teacher = document.forms['teacher'];  
    let year = DataExtract.getSelectedValueWithAlternative(teacher.teacherNoYear, '');
    let teacherNo =  year;

    if(teacherNo && teacherNo.length === 3){
      TeacherNo.selectValidSeqList(year,  "teacherNoSeq");
    }    
  }//teacherNoValidCheck
  
  TeacherNo.selectValidSeqWithCurrentList(teacher.teacherNo.substring(0,2),   "teacherNoSeq", teacher.teacherNo.substring(2,5 ));
 
 /**
  * 저장
  */ 
 const updateStudentBasicInfo = () => {

  let teacherBasicInfo = document.forms['teacher'];  

  if(Valid.isEmpty(DataExtract.getSelectedValueWithAlternative(teacherBasicInfo.teacherNoYear, ''), '임용연도')){
    return;
  }
  if(Valid.isEmpty(DataExtract.getSelectedValueWithAlternative(teacherBasicInfo.teacherNoSeq, ''), '일련번호')){
    return;
  }

  const url = '/api/teacher/basic/update';
  const formData = new FormData();
  let teacherNo = DataExtract.getSelectedValueWithAlternative(teacherBasicInfo.teacherNoYear, '') + 
                  DataExtract.getSelectedValueWithAlternative(teacherBasicInfo.teacherNoSeq, '');
  
  formData.append('teacherId', teacher.teacherId);
  formData.append('teacherNo', teacherNo);
  teacher.teacherNo = teacherNo;

  if(!!teacherBasicInfo.teacherName.value){
    formData.append('teacherName', teacherBasicInfo.teacherName.value);
    teacher.teacherName = teacherBasicInfo.teacherName.value;
  }

  if(!!teacherBasicInfo.teacherEngName.value){
    formData.append('teacherEngName', teacherBasicInfo.teacherEngName.value);
    teacher.teacherEngName = teacherBasicInfo.teacherEngName.value;
  }

  if(!!teacherBasicInfo.birthday.value){
    formData.append('birthday', DataExtract.getDateString(teacherBasicInfo.birthday.value));
    teacher.birthday = DataExtract.getDateString(teacherBasicInfo.birthday.value);  
  }

  if(!!teacherBasicInfo.joinDay.value){
    formData.append('joinDay', DataExtract.getDateString(teacherBasicInfo.joinDay.value));  
    teacher.joinDay = DataExtract.getDateString(teacherBasicInfo.joinDay.value);
  }

  //퇴직일자
  if(!!teacherBasicInfo.resignDay.value){
    if(DataExtract.getSelectedValue(teacherBasicInfo.workStatus) === 'R'){
      formData.append('resignDay', DataExtract.getDateString(teacherBasicInfo.resignDay.value));  
      teacher.resignDay = DataExtract.getDateString(teacherBasicInfo.resignDay.value);
    }else if(DataExtract.getSelectedValue(teacherBasicInfo.workStatus) === 'W'){
      formData.append('resignDay', '');  
      teacher.resignDay = '';
    }
  }
  
  //재직상태
  if(teacher.workStatus != DataExtract.getSelectedValue(teacherBasicInfo.workStatus)){  
    formData.append('workStatus', DataExtract.getSelectedValue(teacherBasicInfo.workStatus));
    teacher.workStatus = DataExtract.getSelectedValue(teacherBasicInfo.workStatus);
    teacher.workStatusStr = DataExtract.getSelectedText(teacherBasicInfo.workStatus);
  }
  
  if(teacher.gender != DataExtract.getSelectedValue(teacherBasicInfo.gender)){  
    formData.append('gender', DataExtract.getSelectedValue(teacherBasicInfo.gender)); 
    teacher.gender = DataExtract.getSelectedValue(teacherBasicInfo.gender);
    teacher.genderStr = DataExtract.getSelectedText(teacherBasicInfo.gender);
  }

  if(!!teacherBasicInfo.email.value){
    formData.append('email', DataExtract.getEmpty(teacherBasicInfo.email.value));  
    teacher.email = DataExtract.getEmpty(teacherBasicInfo.email.value);
  }

  if(!!teacherBasicInfo.mobileNo.value){
    formData.append('mobileNo', teacherBasicInfo.mobileNo.value);  
    teacher.email = DataExtract.getEmpty(teacherBasicInfo.email.value);
  }
  
  //직무
  if(teacher.duty != DataExtract.getSelectedValue(teacherBasicInfo.duty)){  
    formData.append('duty', DataExtract.getSelectedValue(teacherBasicInfo.duty));
    teacher.duty = DataExtract.getSelectedValue(teacherBasicInfo.duty);
    teacher.dutyName = DataExtract.getSelectedText(teacherBasicInfo.duty);
  }

  if(!!teacherBasicInfo.plz.value){
    formData.append('plz', teacherBasicInfo.plz.value);  
    teacher.plz = DataExtract.getEmpty(teacherBasicInfo.plz.value);
  }

  if(!!teacherBasicInfo.addressCity.value){
    formData.append('addressCity', teacherBasicInfo.addressCity.value);
    teacher.addressCity = DataExtract.getEmpty(teacherBasicInfo.addressCity.value);  
  }

  if(!!teacherBasicInfo.addressDtl.value){
    formData.append('addressDtl', teacherBasicInfo.addressDtl.value);
    teacher.addressDtl = DataExtract.getEmpty(teacherBasicInfo.addressDtl.value);
  }
  formData.append('updId', 'root');  
   
  const config = {
      headers : {'content-type' : 'multipart/form-data'},
      proxy: Proxy.ProxyConfig
  }

  post(url, formData, config, Response)
  .then(response => {
    if(response.data.result === "success"){
      alert('저장 성공');
      onSaveAndClose(teacher);
    }else{      
      alert('저장 실패');
      onClose();
    }
  });
 }//updateStudentBasicInfo

  return (
    <Modal
      onSaveAndClose={onSaveAndClose}
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="teacher">
          <CardHeader title="교직원 기본정보 수정" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell style={{width:120}}>교직원번호</TableCell>
                  <TableCell>                    
                    <select
                      className={classes.selectBox1}
                      id="teacherNoYear"
                      name="teacherNoYear"
                      onChange={teacherNoValidCheck}   
                    >
                      <CommonCode superCode="CLASS_NO_YY" selectedValue={teacher.teacherNo.substring(0,2)}/>
                    </select>                  
                             
                    <select
                      className={classes.selectBox1}
                      id="teacherNoSeq"
                      name="teacherNoSeq"
                    >
                    </select>   
                  </TableCell>
                  <TableCell>성명</TableCell>
                  <TableCell>
                    <TextField
                      name="teacherName"
                      id="teacherName"
                      //onChange={handleFieldChange}
                      defaultValue={teacher.teacherName}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>영문명</TableCell>
                  <TableCell>
                    <TextField
                      name="teacherEngName"
                      id="teacherEngName"
                      //onChange={handleFieldChange}
                      defaultValue={teacher.teacherEngName}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>
                    <select
                      className={classes.selectBox1}
                      id="gender"
                      name="gender"
                    >                    
                    <CommonCode superCode="GENDER" selectedValue={teacher.gender}/>
                    </select>
                  </TableCell>                  
                </TableRow>

                <TableRow>
                  <TableCell>생년월일</TableCell>
                  <TableCell>  
                    <TextField
                      id="birthday"
                      name="birthday"
                      label="생년월일"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(teacher.birthday, '-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />  
                  </TableCell>
                  <TableCell>재직상태{teacher.workStatus}</TableCell>
                    <TableCell>
                      <select
                        className={classes.selectBox1}
                        id="workStatus"
                        name="workStatus"
                      >                    
                      <CommonCode superCode="WORK_STATUS" selectedValue={teacher.workStatus}/>
                      </select>
                  </TableCell>
                  <TableCell>임용일자</TableCell>
                  <TableCell>     
                    <TextField
                      id="joinDay"
                      name="joinDay"
                      label="임용일자"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(teacher.joinDay,'-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> 
                  </TableCell>
                  <TableCell>퇴직일자</TableCell>
                  <TableCell>     
                    <TextField
                      id="resignDay"
                      name="resignDay"
                      label="퇴사일자"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(teacher.resignDay,'-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                </TableRow> 
                
                <TableRow>
                  <TableCell>E-Mail</TableCell>
                  <TableCell>
                    <TextField
                      name="email"
                      id="email"
                      placeholder="최대 40자"
                      onChange={(event) => Valid.maxLength(event, 45, 'E-Mail')}
                      defaultValue={teacher.email}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>전화번호</TableCell>
                  <TableCell>
                    <TextField
                      name="mobileNo"
                      id="mobileNo"
                      placeholder="최대 45자"
                      onChange={(event) => Valid.maxLength(event, 45, '핸드폰')}
                      defaultValue={teacher.mobileNo}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>직무</TableCell>
                  <TableCell colSpan="3">
                      <select
                        className={classes.selectBox1}
                        id="duty"
                        name="duty"
                      >                    
                      <CommonCode superCode="DUTY" selectedValue={teacher.duty}/>
                      </select>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell>PLZ</TableCell>
                  <TableCell>
                    <TextField
                      className={classes.plz}
                      name="plz"
                      id="plz"
                      placeholder="최대 5자"
                      onChange={(event) => Valid.maxLength(event, 5, 'PLZ')}
                      defaultValue={teacher.plz}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>주소(도시)</TableCell>
                  <TableCell colSpan="5">
                    <TextField
                      className={classes.address}
                      name="addressCity"
                      id="addressCity"
                      placeholder="최대 50자"
                      onChange={(event) => Valid.maxLength(event, 50, '주소(도시)')}
                      defaultValue={teacher.addressCity}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>주소(상세)</TableCell>
                  <TableCell colSpan="5">
                    <TextField
                      className={classes.address}
                      name="addressDtl"
                      id="addressDtl"
                      placeholder="최대 50자"
                      onChange={(event) => Valid.maxLength(event, 50, '주소(도시)')}
                      defaultValue={teacher.addressDtl}
                      variant="outlined"
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
              onClick={onClose}
              variant="contained">
              닫기
            </Button>
            <Button
              color="primary"
              onClick={updateStudentBasicInfo}
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

BasicInfoEditModal.propTypes = {
  className: PropTypes.string,
  teacher: PropTypes.any,
  onSaveAndClose: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

BasicInfoEditModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSaveAndClose: () => {}
};

export default BasicInfoEditModal;
