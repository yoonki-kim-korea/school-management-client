import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from './SearchBar';
import Header from './Header';
import Results from './Results';
import Event from './Event';
import DataExtract from '../../../utils/DataExtract';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function TeacherManagementList({match}) {
  const classes = useStyles();
  const [teachers, setTeachers] = useState([]);
  const newTeacherId = match.params.teacherId;

  /**
   * 목록 조회
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/teacher/list?' + query);
    const body = await response.json();
    return body;
  }

  const searchOnlyTeacherName = () => {
    let query  = '';
        query += 'teacherName=' + document.getElementById('teacherNameSearch').value;
        
    callApi(query)
    .then(response => {
      if(response.teachers.length == 0){
        alert('조회결과가 없습니다.')
      }
      setTeachers(response.teachers);
    })
    .catch(err => console.log(err));
  }; //searchOnlyTeacherName

  /**
   * 검색
   */
  const search = (teacherId) => {
    let query  = '';
    if(DataExtract.isNumber(teacherId)){
      query += 'teacherId=' + teacherId;
    }else{
      query += 'teacherSearch='  + document.getElementById('teacherSearch').value + '&';
      query += 'searchKeyword='  + document.getElementById('searchKeyword').value + '&';
      query += 'workStatus='     + document.getElementById('workStatus').value + '&';
      query += 'department='     + document.getElementById('department').value + '&';
      query += 'grade='          + document.getElementById('grade').value + '&';
      query += 'classNo='        + document.getElementById('classNo').value + '&';
      query += 'classTime='      + document.getElementById('classTime').value + '&';
      query += 'classType='      + document.getElementById('classType').value + '&';
      query += 'duty='           + document.getElementById('duty').value + '&';
      query += 'teacherDate='    + document.getElementById('teacherDate').value + '&';
      query += 'startDate='      + DataExtract.getDateString(document.getElementById('startDate').value) + '&';    
      query += 'endDate='        + DataExtract.getDateString(document.getElementById('endDate').value);  
    }
        
    callApi(query)
    .then(response => {
      if(response.teachers.length == 0){
        alert('조회결과가 없습니다.')
      }
      setTeachers(response.teachers);
    })
    .catch(err => console.log(err));
  }; //search

  return (
    <Page
      className={classes.root}
      title="교직원 관리"
    >
      <Container maxWidth={false}>
        <Header />
        <SearchBar
          searchOnlyTeacherName={searchOnlyTeacherName}
          onSearch={search}
        />
        {teachers && (
          <Results
            className={classes.results}
            teachers={teachers}
            search={search}
          />
        )}
      </Container>
      <Event search={search} teacherId={newTeacherId}/>
    </Page>
  );
}

export default TeacherManagementList;