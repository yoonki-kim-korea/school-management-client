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
    const response = await fetch('/api/stats/semester/personal/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 수업료 목록  조회
   */
  const searchSchoolfee = () => {   
    
    if(DataExtract.getSelectedValue( document.getElementById('semesterId')) == ""){
      alert("학기를 선택해야 합니다.");
      return;
    }

    let query  = ''; 
    query += '&semesterId=' + DataExtract.getSelectedValue( document.getElementById('semesterId'));
    query += '&department=' + DataExtract.getSelectedValue( document.getElementById('department'));
       
    callApi(query)
    .then(response => {
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
        title="학기별 학급별 인원 현황"
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