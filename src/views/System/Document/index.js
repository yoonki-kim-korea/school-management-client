import React, { useState, useEffect } from 'react';
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

function DocumentManagement() {
  const classes = useStyles();
  const [documents, setDocuments] = useState([]);

  /**
   * 목록 조회
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/document/view?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 문서별 항목 목록 검색
   */
  const search = () => {
    
  if(!DataExtract.getSelectedValue(document.getElementById('documentId'))) {
    alert('문서를 입력하지 않았습니다.');
    return;
  };  
  
    let query  = '';
        query += 'documentId=' + DataExtract.getSelectedValue(document.getElementById('documentId'));  
    callApi(query)
    .then(response => {
      if(response.documents.length == 0){
        alert('저장된 항목이 없습니다.');
      }
      setDocuments(response.documents);
    })
    .catch(err => console.log(err));
  }; //search

  
  const IsearchWithValue = (pSuperCode) => {
    let query  = '';
        query += 'documentId=' + pSuperCode;  
    callApi(query)
    .then(response => {
      setDocuments(response.documents);
    })
    .catch(err => console.log(err));
  }; //search

  return (

      <Page
        className={classes.root}
        title="문서 관리"
      >
        <Container maxWidth={false}>
          <Header search={IsearchWithValue}/>
          <SearchBar onSearch={search} />
          {documents && (
            <Results
              className={classes.results}
              documents={documents}
              search={search}
            />
          )}
        </Container>
      </Page>
  );
}

export default DocumentManagement;