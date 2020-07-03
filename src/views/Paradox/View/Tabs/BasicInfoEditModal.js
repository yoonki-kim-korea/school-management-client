import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import StudentNo     from '../../../../utils/StudentNo';
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
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  dateField: {
    '& + &': {
      width: 180,
      marginLeft: theme.spacing(2)
    }
  },
  actions: {
    justifyContent: 'flex-end'
  },
  selectBox1 : {
    width: 150,
    height:40,
    display: 'inline-block',
    alignItems: 'left'

  },
  address: {
    width:400
  },
  plz:{
    width:80
  }
}));

function BasicInfoEditModal({ open, onSaveAndClose, onClose, student, className, ...rest }) {
  const classes = useStyles();

 /**
  * 저장
  */ 
 const updateStudentBasicInfo = () => {

  let form = document.forms['form'];  

  if(Valid.isEmpty(DataExtract.getSelectedValueWithAlternative(form.studentNoYear, ''), '학번-연도')){
    return;
  }
  if(Valid.isEmpty(DataExtract.getSelectedValueWithAlternative(form.studentNoDpt, ''), '학번-최초 입학 부서')){
    return;
  }
  if(Valid.isEmpty(DataExtract.getSelectedValueWithAlternative(form.studentNoSeq, ''), '학번 일련번호')){
    return;
  }

  const url = '/api/student/basic/update';
  const formData = new FormData();
  let studentNo = DataExtract.getSelectedValueWithAlternative(form.studentNoYear, '') + 
                  DataExtract.getSelectedValueWithAlternative(form.studentNoDpt, '') + 
                  DataExtract.getSelectedValueWithAlternative(form.studentNoSeq, '');
  
  formData.append('studentId', student.studentId);
  formData.append('studentNo', studentNo);
  student.studentNo = studentNo;

  if(!!form.koreanName.value){
    formData.append('koreanName', form.koreanName.value);
    student.koreanName = form.koreanName.value;
  }

  if(!!form.germanName.value){
      formData.append('germanName', form.germanName.value);
      student.germanName = form.germanName.value;
  }

  if(!!form.birthday.value){
    formData.append('birthday', DataExtract.getDateString(form.birthday.value));
    student.birthday = DataExtract.getDateString(form.birthday.value);  
  }

  if(!!form.entranceDay.value){
    formData.append('entranceDay', DataExtract.getDateString(form.entranceDay.value));  
    student.entranceDay = DataExtract.getDateString(form.entranceDay.value);
  }
  
  if(student.birthPlace != DataExtract.getSelectedValue(form.birthPlace)){  
    formData.append('birthPlace', DataExtract.getSelectedValue(form.birthPlace));
    student.birthPlace = DataExtract.getSelectedValue(form.birthPlace);
    student.birthPlaceStr = DataExtract.getSelectedText(form.birthPlace);
  }
  
  if(student.gender != DataExtract.getSelectedValue(form.gender)){  
    formData.append('gender', DataExtract.getSelectedValue(form.gender)); 
    student.gender = DataExtract.getSelectedValue(form.gender);
    student.genderStr = DataExtract.getSelectedText(form.gender);
  }

  if(!!form.email.value){
    formData.append('email', DataExtract.getEmpty(form.email.value));  
    student.email = DataExtract.getEmpty(form.email.value);
  }

  if(!!form.mobileNo.value){
    formData.append('mobileNo', form.mobileNo.value);  
    student.email = DataExtract.getEmpty(form.email.value);
  }

  if(!!form.plz.value){
    formData.append('plz', form.plz.value);  
    student.plz = DataExtract.getEmpty(form.plz.value);
  }

  if(!!form.addressCity.value){
    formData.append('addressCity', form.addressCity.value);
    student.addressCity = DataExtract.getEmpty(form.addressCity.value);  
  }

  if(!!form.addressDtl.value){
    formData.append('addressDtl', form.addressDtl.value);
    student.addressDtl = DataExtract.getEmpty(form.addressDtl.value);
  }
  formData.append('updId', 'root');  
   
  const config = {
      headers : { 'content-type' : 'multipart/form-data' },
      proxy: Proxy.ProxyConfig
  }
  
  post(url, formData, config, Response)
    .then(response => {
      if(response.data.result === 'success'){
        alert('저장 성공');
        onSaveAndClose(student);
      }else{
        alert('저장 실패');
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
        <form id="form">
          <CardHeader title="학생 기본정보 수정" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{width:120}}>학번</TableCell>
                  <TableCell colSpan="3">    
                  
                  </TableCell>
                </TableRow>  
                <TableRow>
                  <TableCell>한글성명</TableCell>
                  <TableCell>
                    <TextField
                      name="koreanName"
                      id="koreanName"
                      placeholder="최대 15자"
                      defaultValue={student.koreanName}
                      variant="outlined"
                      onChange={(event) => Valid.maxLength(event, 15, '한글성명')}
                    />
                  </TableCell>
                  <TableCell style={{width:120}}>독어성명</TableCell>
                  <TableCell>
                    <TextField
                      name="germanName"
                      id="germanName"
                      placeholder="최대 30자"
                      defaultValue={student.germanName}
                      variant="outlined"
                      onChange={(event) => Valid.maxLength(event, 30, '독어성명')}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell>생년월일</TableCell>
                  <TableCell>
                    <TextField
                      id="birthday"
                      name="birthday"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(student.birthday, '-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                  <TableCell>입학일</TableCell>
                  <TableCell>
                    <TextField
                      id="entranceDay"
                      name="entranceDay"
                      type="date"
                      defaultValue={DataExtract.getFommatedDate(student.entranceDay, '-')}
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>성별</TableCell>
                  <TableCell>
                    <select
                      className={classes.selectBox1}
                      id="gender"
                      name="gender"
                    >                    
                    <CommonCode superCode="GENDER" selectedValue={student.gender}/>
                    </select>
                  </TableCell>
                  <TableCell>출생지</TableCell>
                  <TableCell>
                    <select
                      className={classes.selectBox1}
                      id="birthPlace"
                      name="birthPlace"
                    >                    
                    <CommonCode superCode="BIRTH_PLACE_CD" selectedValue={student.birthPlace}/>
                    </select>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell>핸드폰</TableCell>
                  <TableCell>
                    <TextField
                      name="mobileNo"
                      id="mobileNo"
                      placeholder="최대 45자"
                      defaultValue={student.mobileNo}
                      onChange={(event) => Valid.maxLength(event, 45, '핸드폰')}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>E-Mail</TableCell>
                  <TableCell>
                    <TextField
                      name="email"
                      id="email"
                      placeholder="최대 40자"
                      defaultValue={student.email}
                      onChange={(event) => Valid.maxLength(event, 45, 'E-Mail')}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell>PLZ</TableCell>
                  <TableCell colSpan="3">
                    <TextField
                      name="plz"
                      id="plz"
                      placeholder="최대 5자"
                      defaultValue={student.plz}
                      onChange={(event) => Valid.maxLength(event, 5, 'PLZ')}
                      variant="outlined"
                      className={classes.plz}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>주소(도시)</TableCell>
                  <TableCell colSpan="3">
                    <TextField
                      name="addressCity"
                      id="addressCity"
                      placeholder="최대 50자"
                      defaultValue={student.addressCity}
                      onChange={(event) => Valid.maxLength(event, 50, '주소(도시)')}
                      variant="outlined"
                      className={classes.address}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>주소(상세)</TableCell>
                  <TableCell colSpan="3">
                    <TextField
                      name="addressDtl"
                      id="addressDtl"
                      placeholder="최대 50자"
                      defaultValue ={student.addressDtl}
                      onChange={(event) => Valid.maxLength(event, 50, '주소(상세)')}
                      variant="outlined"
                      className={classes.address}
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
  student: PropTypes.any,
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
