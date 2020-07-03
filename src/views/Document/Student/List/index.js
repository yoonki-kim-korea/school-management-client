import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from './SearchBar';
import Header from './Header';
import Results from './Results';
import DataExtract from '../../../../utils/DataExtract';

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
 * 수업료 관리
 * @param {*} match 
 */
function SchoolfeeManagement() {
  const classes = useStyles();
  const [results, setResults] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/student/status/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 수업료 목록  조회
   */
  const searchSchoolfee = () => {   
    
    document.getElementById('searchBtn').innerHTML = "조회 중...";

    let query  = ''; 
        query += '&studentStatus='   + DataExtract.getSelectedValueWithAlternative( document.getElementById('studentStatus'), '')
        query += '&semesterId='      + DataExtract.getSelectedValueWithAlternative( document.getElementById('semesterId'), '')
        query += '&department='      + DataExtract.getSelectedValueWithAlternative( document.getElementById('department'), '')
        query += '&grade='           + DataExtract.getSelectedValueWithAlternative( document.getElementById('grade'), '')
        query += '&classNo='         + DataExtract.getSelectedValueWithAlternative( document.getElementById('classNo'), '')    
        query += '&teacherId='       + DataExtract.getSelectedValueWithAlternative( document.getElementById('teacherId'), '') 
        query += '&studentName='     + document.getElementById('studentName').value;
        query += '&studentNo='       + document.getElementById('studentNo').value;
        query += '&applyYear='       + DataExtract.todayDate("").substring(0,4);
        query += '&today='           + DataExtract.todayDate("");
       
    callApi(query)
    .then(response => {
      document.getElementById('searchBtn').innerHTML = "검색";
      if(response.results.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setResults(response.results);
    })
    .catch(err => console.log(err));
  }; //searchSchoolfee

  return (
      <Page
        className={classes.root}
        title="휴●복학 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchSchoolfee}/>
          <SearchBar onSearch={searchSchoolfee}/>
          {results && (
            <Results
              className={classes.results}
              results={results}
              search={searchSchoolfee}
            />
          )}
        </Container>
      </Page>
  );
}

export default SchoolfeeManagement;