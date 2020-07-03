import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from './SearchBar';
import Header from './Header';
import Results from './Results';

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
 * 교실 관리
 * @param {*} match 
 */
function ClassroomManagement() {
  const classes = useStyles();
  const [classrooms, setClassrooms] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/classroom/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 교실 목록 조회
   */
  const searchClassroom = () => {    
    let query = '';    
        query += 'classroomName=' + document.getElementById('classroomName').value ;
    callApi(query)
    .then(response => {
      if(response.classrooms.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setClassrooms(response.classrooms);
    })
    .catch(err => console.log(err));
  }; //searchClassroom

  return (
      <Page
        className={classes.root}
        title="교실 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchClassroom}/>
          <SearchBar onSearch={searchClassroom}/>
          {classrooms && (
            <Results
              className={classes.results}
              classrooms={classrooms}
              search={searchClassroom}
            />
          )}
        </Container>
      </Page>
  );
}

export default ClassroomManagement;