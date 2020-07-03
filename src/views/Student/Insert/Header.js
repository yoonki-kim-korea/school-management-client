import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Typography,
  Button,
  Grid,
  colors 
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DataExtract from '../../../utils/DataExtract';
import Valid from '../../../utils/Valid';
import Proxy from '../../../utils/Proxy';

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: {
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },
  saveButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.blue[600],
    '&:hover': {
      backgroundColor: colors.blue[900]
    },
    margin:2
  },
  saveIcon: {
    marginRight: theme.spacing(1)
  },
  cancelButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.grey[600],
    '&:hover': {
      backgroundColor: colors.grey[900]
    },
    margin:2
  },
  cancelIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Header({ className, ...rest }) {
  const classes = useStyles();

  /**
   * 입력란 초기화
   */
  const calendarForm = () => {
    let form = document.forms['form'];  
    form.studentNoSeq.value = '';
    form.koreanName.value = '';
    form.germanName.value = '';
    form.mobileNo.value = '';
    form.plz.value = '';
    form.email.value = '';
    form.addressCity.value = '';
    form.addressDtl.value = '';
    form.fatherName.value = '';
    form.fatherNameEng.value = '';
    form.fatherPhoneNo.value = '';
    form.motherName.value = '';
    form.motherNameEng.value = '';
    form.motherPhoneNo.value = '';
    form.accountNo.value = '';
    form.accountHolder.value = '';
    form.iban.value = '';
    form.bic.value = '';

    form.studentNoYear.value = '';
    form.studentNoDpt.value = '';
    form.birthPlace.value = '';
    form.birthday.value = '9999-12-31';
    form.entranceDay.value = '9999-12-31';
    form.gender.value = '';
    form.representYn.value = '';
    form.bank.value = '';    
  }//calendarForm
 

  /**
   * 학생정보 저장
   */
  const saveStudent = () => {
    let form = document.forms['form'];  

    if(Valid.isEmpty(DataExtract.getSelectedValue(form.studentNoYear), '학번-연도')){
      return;
    }
    if(Valid.isEmpty(DataExtract.getSelectedValue(form.studentNoDpt), '학번-최초 입학 부서')){
      return;
    }
    if(Valid.isEmpty(DataExtract.getSelectedValue(form.studentNoSeq), '학번 일련번호')){
      return;
    }
    
    if(Valid.isEmpty(form.koreanName.value, '한글성명')){
      return;
    }

    const url = '/api/student/save';
    const formData = new FormData();
    let studentNo = DataExtract.getSelectedValue(form.studentNoYear) + 
                    DataExtract.getSelectedValue(form.studentNoDpt) + 
                    DataExtract.getSelectedValue(form.studentNoSeq);
    
    formData.append('studentNo', studentNo);
    formData.append('koreanName', form.koreanName.value);
    formData.append('germanName', form.germanName.value);
    formData.append('birthday', DataExtract.getDateString(form.birthday.value));
    formData.append('entranceDay', DataExtract.getDateString(form.entranceDay.value));
    formData.append('birthPlace', DataExtract.getSelectedValue(form.birthPlace));
    formData.append('gender', DataExtract.getSelectedValue(form.gender));
    formData.append('email', DataExtract.getEmpty(form.email.value));
    formData.append('mobileNo', form.mobileNo.value);
    formData.append('plz', form.plz.value);
    formData.append('addressCity', form.addressCity.value);
    formData.append('addressDtl', form.addressDtl.value);
    formData.append('fatherName', form.fatherName.value);
    formData.append('fatherNameEng', form.fatherNameEng.value);
    formData.append('fatherPhoneNo', form.fatherPhoneNo.value);
    formData.append('motherName', form.motherName.value);
    formData.append('motherNameEng', form.motherNameEng.value);
    formData.append('representYn', DataExtract.getSelectedValue(form.representYn));
    formData.append('motherPhoneNo', form.motherPhoneNo.value);
    formData.append('bank', DataExtract.getSelectedValue(form.bank));
    formData.append('accountNo', form.accountNo.value);
    formData.append('accountHolder', form.accountHolder.value);
    formData.append('iban', form.iban.value);
    formData.append('bic', form.bic.value);  
    formData.append('creId', 'root');  
     
    const config = {
        headers : { 'content-type' : 'multipart/form-data' },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
      if(response.data.result === "success"){
        calendarForm();
        alert('저장 성공');
        let url = `/student/list/${response.data.studentId}`;        
        document.getElementById('studentList').href = url;
        return document.getElementById('studentList').click();
      }else{
        alert("저장 실패");
      }
    });
  }//saveStuden

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >   <a id="studentList" href="/student/list"></a>
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            학생관리
          </Typography>

          <Typography
            component="h1"
            variant="h3"
          >
            학생 정보 입력        
          </Typography>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} variant="contained" onClick={()=>{window.history.back();}}>
            <CancelIcon className={classes.cancelIcon} />
            닫기
          </Button>
          <Button className={classes.saveButton} variant="contained" onClick={saveStudent}>
            <SaveIcon className={classes.saveIcon} />
            저장
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;