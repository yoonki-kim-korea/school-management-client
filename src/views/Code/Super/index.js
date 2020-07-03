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

function SuperCodeManagement() {
  const classes = useStyles();
  const [superCodes, setSuperCodes] = useState([]);
  /**
   * 목록 조회
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/codem/superlist?' + query);
    const body = await response.json();
    return body;
  }

  const searchWithSuperCode = (pSuperCode) => {
    let query  = '';
    query  = 'superCode='     + pSuperCode + '&';
    query += 'superCodeName=' + document.getElementById('superCodeName').value;  
    callApi(query)
    .then(response => {
      setSuperCodes(response.superCodes);
    })
    .catch(err => console.log(err));
  }; //search

  const search = () => {
    let query  = '';
    query  = 'superCode='     + document.getElementById('superCode').value + '&';
    query += 'superCodeName=' + document.getElementById('superCodeName').value;  
    callApi(query)
    .then(response => {
      setSuperCodes(response.superCodes);
    })
    .catch(err => console.log(err));
  }; //search

  return (

      <Page
        className={classes.root}
        title="슈퍼 공통코드 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchWithSuperCode}/>
          <SearchBar onSearch={search} />
          {superCodes && (
            <Results
              className={classes.results}
              superCodes={superCodes}
              search={search}
            />
          )}
        </Container>
      </Page>
  );
}

export default SuperCodeManagement;