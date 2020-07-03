import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from './SearchBar';
import Header from './Header';
import Results from './Results';
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

/**
 * 학기 관리
 * @param {*} match 
 */
function SemesterManagement() {
  const classes = useStyles();
  const [semesters, setSemesters] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/semester/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 학가 목록 조회
   */
  const searchSemester = () => {
    let query = '';    
        query += 'semesterYear=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('semesterYear'), '') + '&';
        query += 'semesterType=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('semesterType'), '') ;
    callApi(query)
    .then(response => {
      if(response.semesters.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setSemesters(response.semesters);
    })
    .catch(err => console.log(err));
  }; //searchSemester

  return (

      <Page
        className={classes.root}
        title="학기 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchSemester}/>
          <SearchBar onSearch={searchSemester}/>
          {semesters && (
            <Results
              className={classes.results}
              semesters={semesters}
              search={searchSemester}
            />
          )}
        </Container>
      </Page>
  );
}

export default SemesterManagement;