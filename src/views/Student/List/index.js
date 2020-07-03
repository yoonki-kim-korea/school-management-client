import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from './SearchBar';
import Header from './Header';
import Results from './Results';
import DataExtract from '../../../utils/DataExtract';
import Event from './Event';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

/**
 * 학생관리 목록
 * @param {*} param0 
 */
function StudentManagementList({match}) {
  const classes = useStyles();
  const [students, setStudents] = useState([]);
  const newStudentId   = match.params.studentId;

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/student/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 학생조회
   */
  const searchOnlyStudentNo = () => {
    let query  = '';
        query += 'studentNo=' + document.getElementById('studentNoSearch').value;
    callApi(query)
    .then(response => {
        if(response.students.length == 0){
            alert('조회결과가 없습니다.');
        }
        setStudents(response.students);
    })
    .catch(err => console.log(err));
  }; //searchOnlyStudentNo

  /**
   * 학생조회
   */
  const search = (newStudentId) => {
    let query  = '';
    if(DataExtract.isNumber(newStudentId)){
      query += 'studentId=' + newStudentId;
    }else{
      query += 'studentSearch='  + document.getElementById('studentSearch').value + '&';
      query += 'searchKeyword='  + document.getElementById('searchKeyword').value + '&';
      query += 'gender='         + document.getElementById('gender').value + '&';
      query += 'teacher='        + document.getElementById('teacher').value + '&';
      query += 'department='     + document.getElementById('department').value + '&';
      query += 'grade='          + document.getElementById('grade').value + '&';
      query += 'classNo='        + document.getElementById('classNo').value + '&';
      query += 'classTime='      + document.getElementById('classTime').value + '&';
      query += 'studentDate='    + document.getElementById('studentDate').value + '&';
      query += 'startDate='      + DataExtract.getDateString(document.getElementById('startDate').value) + '&';    
      query += 'endDate='        + DataExtract.getDateString(document.getElementById('endDate').value);  
    }
        
    callApi(query)
    .then(response => {
      if(response.students.length == 0){
          alert('조회결과가 없습니다.');
      }
      setStudents(response.students);
    })
    .catch(err => console.log(err));
  }; //search

  return (
    <Page
      className={classes.root}
      title="재학생 관리"
    >
      <Container maxWidth={false}>
        <Header />
        <SearchBar
          searchOnlyStudentNo={searchOnlyStudentNo}
          onSearch={search}
        />
        {students && (
          <Results
            className={classes.results}
            students={students}
          />
        )}
      </Container>
      <Event search={search} studentId={newStudentId}/>
    </Page>
  );
}

export default StudentManagementList;