import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  Paper,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Button,
  Typography
} from '@material-ui/core';
import CommonCode from '../../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../../utils/SpecialCommonCode';
import DataExtract from '../../../../../utils/DataExtract';
import Titel from '../Titel';
import CandidatesResult from './CandidatesResult';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1500,
    height:800,
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
  classInfoTable:{
      width:1200,
      border:1
  },
  section: {
    '& + &': { marginTop: theme.spacing(5) }
  },
  
  searchConditions: {
    display: 'flex',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10
  },
  selectBoxPaper: {marginRight:10},
  selectBox:{
    height: 42,
    width:150,
  },
  search: {
    flexGrow: 1,
    height: 42,
    width:200,
    marginRight:5,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon  

  },
  searchInput: {
    flexGrow: 1,
    width:150
  },
  searchButton: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'left'
  }

}));

/**
 * 운영학급관리 > 학생 재배정 및 관리 > 학생전입 모달
 * @param {*} param0 
 */
function InsertStudentModal({ open, classId, classType, search, onClose, className, ...rest }) {
  const classes = useStyles(); 
  const [candidates, setCandidates] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }

  /**
   * 전입대상 학생 목록 조회
   */
  const searchStudent = () => {        
    let form = document.forms['form'];  
    let query = '/api/classinfo/candidate/list?'; 
        query += 'classId=' + classId + '&';
        query += 'semester=' + DataExtract.getSelectedValueWithAlternative( form.semester, '') + '&';
        query += 'department=' + DataExtract.getSelectedValueWithAlternative( form.department, '') + '&';
        query += 'grade=' + DataExtract.getSelectedValueWithAlternative( form.grade, '') + '&';
        query += 'classNo=' + DataExtract.getSelectedValueWithAlternative( form.classNo, '') + '&';    
        query += 'classTime=' + DataExtract.getSelectedValueWithAlternative(form.classTime, '') + '&';
        query += 'studentNo=' + form.studentNo.value ; 

    callApi(query)
    .then(response => {
      if(response.candidates.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setCandidates(response.candidates);
    })
    .catch(err => console.log(err));
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
          <CardHeader title="전입 대상 학생 조회" />
          <Divider />
          <CardContent>
            <Titel classId={classId}/>          
          <Divider />

           {/*검색조건******************************************** */}
        <form id="form"> 
          <div className={classes.searchConditions}  >
            <Paper className={classes.selectBoxPaper}>
              <select name="semester" id="semester" className={classes.selectBox}>                    
                <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="Y"/>  
              </select>
            </Paper>
            <Paper className={classes.selectBoxPaper}>
              <select name="department" id="department" className={classes.selectBox} >                    
                <CommonCode superCode="DEPARTMENT" placeHolder="부서" firstSelectYn="Y"/>      
              </select>
            </Paper>
            <Paper className={classes.selectBoxPaper}>
              <select name="grade" id="grade" className={classes.selectBox} >                    
                <CommonCode superCode="GRADE" placeHolder="학년" firstSelectYn="Y"/>      
              </select>
            </Paper>
            <Paper className={classes.selectBoxPaper}>
              <select name="classNo" id="classNo" className={classes.selectBox} >                    
                <CommonCode superCode="CLASS_NO" placeHolder="반" firstSelectYn="Y"/>      
              </select>
            </Paper>
            <Paper className={classes.selectBoxPaper}>
              <select name="classTime" id="classTime" className={classes.selectBox} >                    
                <CommonCode superCode="CLASS_TIME" placeHolder="시간구분" firstSelectYn="Y"/>      
              </select>
            </Paper>
            <Paper className={classes.selectBoxPaper}>
              <TextField
                  className={clsx(classes.field, classes.flexGrow)}
                  label="학번/성명"
                  margin="dense"
                  id="studentNo"
                  name="studentNo"
                  variant="outlined"
              />
            </Paper>
            <Button className={classes.searchButton}
                onClick={searchStudent}
                color="primary" variant="contained" 
              >검색
            </Button>
            <CardActions className={classes.actions}>
              <Button color="primary" variant="contained" onClick={() => { onClose(); }}>
                닫기
              </Button>
            </CardActions>
          </div>
        </form>
        {/*검색조건********************************************* */}

        <div className={classes.section}>
          <Typography gutterBottom variant="h4">
            <CandidatesResult classId={classId} classType={classType} students={candidates} search={search} onClose={onClose}/>
          </Typography>
        </div>            
          </CardContent>
          <Divider />
         
      </Card>
    </Modal>
  );
}

InsertStudentModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  InsertStudentModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default InsertStudentModal;
