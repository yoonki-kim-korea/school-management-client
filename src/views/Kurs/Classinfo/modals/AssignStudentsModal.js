import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';
import DataExtract from '../../../../utils/DataExtract';
import TransferList from './TransferList';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: 'none',
      boxShadow: theme.shadows[20],
      width: 1800,
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
        width:1500,
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
      marginRight:10,
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
 * 배정후보학생 중에서 선택한 학생목록을 저장하는 배열. 모달팝업이 닫힐 때 []로 초기화된다.
 */ 
function AssignStudentsModal({ classinfo, assignList, open, searchList, onClose, className, ...rest }) {
    const classes = useStyles(); 
    const [candidates, setCandidates] = useState([]);

    const modalClose = () => {
      setCandidates([]); 
      searchList();
      onClose();
    }

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
     * 배정대상 학생목록 조회
     */
    const candidateStudents = () => {        
        let form = document.forms['form'];  
        let query = '/api/classinfo/candidate/list?'; 
            query += 'classId=' + classinfo.classId + '&';
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
    }//candidateStudents

    /**
     * 배정 저장
     */
    const saveAssignStudents = () => {
      document.getElementById('saveBtn').click();
    }//saveAssignStudents
    
  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
          <CardHeader title="학생 배정" />
          <Divider />
          <CardContent>
            <Table className={classes.classInfoTable}>
              <TableBody>
                <TableRow>
                  <TableCell>학기</TableCell> 
                  <TableCell>부서</TableCell>
                  <TableCell>학년</TableCell>
                  <TableCell>반</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>시간구분</TableCell>
                  <TableCell>담임</TableCell>
                  <TableCell>교실</TableCell>
                  <TableCell>정원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{classinfo.semesterName}</TableCell>
                  <TableCell>{classinfo.departmentName}</TableCell>
                  <TableCell>{classinfo.gradeName}</TableCell>
                  <TableCell>{classinfo.classNoName}</TableCell>
                  <TableCell>{classinfo.classTypeName}</TableCell>
                  <TableCell>{classinfo.classTimeName}</TableCell>
                  <TableCell>{classinfo.teacherName}</TableCell>
                  <TableCell>{classinfo.classroomName}</TableCell>
                  <TableCell>{classinfo.classCapacity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>            
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
                onClick={candidateStudents}
                color="primary" variant="contained" 
              >검색
            </Button>
            <CardActions className={classes.actions}>
              <Button color="primary" variant="contained" onClick={() => { modalClose(); }}>
                닫기
              </Button>
              <Button color="primary" variant="contained" onClick={saveAssignStudents}>
                반배정 저장
              </Button>
            </CardActions>
          </div>
        </form>
        {/*검색조건********************************************* */}

        <div className={classes.section}>
          <Typography gutterBottom variant="h4">
           {/*하단 테이블 ********************************************* */}
           <TransferList candidates={candidates} setCandidates={setCandidates} classinfo={classinfo} modalClose={modalClose} assignList={assignList} searchList={searchList}/>
          </Typography>
        </div>            
          </CardContent>
          <Divider />
         
      </Card>
    </Modal>
  );
}

AssignStudentsModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  AssignStudentsModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  
export default AssignStudentsModal;
