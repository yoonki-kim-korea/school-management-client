import React, { useState, useEffect } from 'react';
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
 * 학생별 메모
 * @param {*} param0 
 */
function MemoManagement({match}) {
  const classes = useStyles();
  const [diarys, setDiarys] = useState([]);
  const studentId   = match.params.studentId;

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/diary/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 학생별 메모 목록 조회
   */
  const searchMomos = () => {
    let query = '';    
        query += 'studentId=' + studentId ;
        query += '&content='  + document.getElementById('content').value;  
    callApi(query)
    .then(response => {
      if(response.diarys.length == 0){
        alert('조회 결과가 없습니다.');
      }
      setDiarys(response.diarys);
    })
    .catch(err => console.log(err));
  }; //searchMomos

  return (
      <Page
        className={classes.root}
        title="학생별 메모 관리"
      >
        <Container maxWidth={false}>
          <Header studentId={studentId} search={searchMomos} />
          <SearchBar onSearch={searchMomos}/>
          {diarys && (
            <Results
              className={classes.results}
              diarys={diarys}
              studentId={studentId}
              search={searchMomos}
            />
          )}
        </Container>
      </Page>
  );
}

export default MemoManagement;