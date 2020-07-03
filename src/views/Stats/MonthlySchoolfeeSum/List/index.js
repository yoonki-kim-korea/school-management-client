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
    const response = await fetch('/api/stats/monthly/schoolfee/sum/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 수업료 목록  조회
   */
  const search = () => {   
    
    if(DataExtract.getSelectedValue( document.getElementById('applyYear')) == ""){
      alert("연도를 선택해야 합니다.");
      return;
    }  
    
    if(DataExtract.getSelectedValue( document.getElementById('applyMonth')) == ""){
      alert("월을 선택해야 합니다.");
      return;
    }  
    let query  = ''; 
    query += '&applyYear=' + DataExtract.getSelectedValue( document.getElementById('applyYear'));
    query += '&applyMonth=' + DataExtract.getSelectedValue( document.getElementById('applyMonth'));
       
    callApi(query)
    .then(response => {
      if(response.results.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setResults(response.results);
    })
    .catch(err => console.log(err));
  }; //search

  return (
      <Page
        className={classes.root}
        title="월별 수업료 합산"
      >
        <Container maxWidth={false}>
          <Header search={search}/>
          <SearchBar onSearch={search}/>
          {results && (
            <Results
              className={classes.results}
              results={results}
              search={search}
            />
          )}
        </Container>
      </Page>
  );
}

export default SchoolfeeManagement;