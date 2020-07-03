import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import Titel from './Titel';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

/**
 * 학급관리 > 종료학급관리 > 학생목록
 * @param {*} param0 
 */
function ClassStudents({ match, history }) {
  const classes = useStyles();
  /**
   * 부모창에서 가져온 학급ID
   */
  const { classId, classType } = match.params;
  const [students, setStudents] = useState();

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
   * 학급의 학생목록 조회
   */
  const search = async () => {
    let query = '/api/operclass/management/list?classId=' + classId;
    callApi(query)
    .then(response => {
      setStudents(response.students);
    })
    .catch(err => console.log(err));
  }; //search


  useEffect(() => {
    let mounted = true;
    search();
    return () => {
      mounted = false;
    };
  }, []);

  return (
      <Page
        className={classes.root}
        title="종료학급 학생목록"
      >
        <Container maxWidth={false}>
          <Header classId={classId} classType={classType} search={search}/>
          <Titel classId={classId}/>
          {students && (
            <Results
              className={classes.results}
              students={students}
              search={search}
            />
          )}
        </Container>
      </Page>
  );
}

export default ClassStudents;