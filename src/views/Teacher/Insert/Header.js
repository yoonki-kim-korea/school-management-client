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
    let teacher = document.forms['teacher'];  
    teacher.teacherNoSeq.value = '';
    teacher.teacherName.value = '';
    teacher.teacherEngName.value = '';
    teacher.birthday.value = '9999-12-31';
    teacher.joinDay.value = '9999-12-31';
    teacher.resignDay.value = '9999-12-31';
    teacher.workStatus.value = '';
    teacher.gender.value = '';
    teacher.email.value = '';
    teacher.mobileNo.value = '';
    teacher.plz.value = '';
    teacher.addressCity.value = '';
    teacher.addressDtl.value = '';
    
  }//calendarForm

  /**
   * 학생정보 저장
   */
  const saveTeacher = () => {

    let teacher = document.forms['teacher'];  

    if(Valid.isEmpty(DataExtract.getSelectedValue(teacher.teacherNoYear), '입사연도')){
      return;
    }
    if(Valid.isEmpty(DataExtract.getSelectedValue(teacher.teacherNoSeq), '일련번호')){
      return;
    }
    
    if(Valid.isEmpty(teacher.teacherName.value, '성명')){
      return;
    }

    const url = '/api/teacher/save';
    const formData = new FormData();
    let teacherNo = DataExtract.getSelectedValue(teacher.teacherNoYear) + 
                    DataExtract.getSelectedValue(teacher.teacherNoSeq);
    
    formData.append('teacherNo', teacherNo);
    formData.append('teacherName', teacher.teacherName.value);
    formData.append('teacherEngName', teacher.teacherEngName.value);
    formData.append('birthday', DataExtract.getDateString(teacher.birthday.value));
    formData.append('joinDay', DataExtract.getDateString(teacher.joinDay.value));
    formData.append('resignDay', DataExtract.getDateString(teacher.resignDay.value));

    formData.append('duty', DataExtract.getSelectedValue(teacher.duty));

    formData.append('workStatus', DataExtract.getSelectedValue(teacher.workStatus));
    formData.append('gender', DataExtract.getSelectedValue(teacher.gender));
    formData.append('email', DataExtract.getEmpty(teacher.email.value));
    formData.append('mobileNo', teacher.mobileNo.value);
    formData.append('plz', teacher.plz.value);
    formData.append('addressCity', teacher.addressCity.value);
    formData.append('addressDtl', teacher.addressDtl.value);
    formData.append('creId', 'root');  
     
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
      if(response.data.result === "success"){
        calendarForm();
        alert('저장 성공');
        let url = `/teacher/list/${response.data.teacherId}`;        
        document.getElementById('teacherList').href = url;
        return document.getElementById('teacherList').click();
      }else{
        alert("저장 실패");
      }
    });
  }//saveStuden

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    > <a id="teacherList" href="/teacher/list"></a>
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
            교직원 관리
          </Typography>

          <Typography
            component="h1"
            variant="h3"
          >
            교직원 정보 입력        
          </Typography>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} variant="contained" onClick={()=>{window.history.back();}}>
            <CancelIcon className={classes.cancelIcon} />
            닫기
          </Button>
          <Button className={classes.saveButton} variant="contained" onClick={saveTeacher}>
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