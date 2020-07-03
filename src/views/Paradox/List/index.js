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
    const response = await fetch('/api/paradox/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 학생조회
   */
  const search = () => {
    let query  = '';
        query += 'snr='         + document.getElementById('snr').value;
        query += '&koreanname=' + document.getElementById('koreanname').value;
        query += '&lastname='   + document.getElementById('lastname').value;
        query += '&vorname='    + document.getElementById('vorname').value;
    
    callApi(query)
    .then(response => {
        if(response.results.length == 0){
            alert('조회결과가 없습니다.');
        }
        setStudents(response.results);
    })
    .catch(err => console.log(err));
  }; //searchOnlyStudentNo

  return (
    <Page
      className={classes.root}
      title="Paradox 학쟁정보 관리"
    >
      <Container maxWidth={false}>
        <Header />
        <SearchBar
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