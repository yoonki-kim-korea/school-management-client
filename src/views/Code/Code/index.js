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

/**
 * 공통코드 관리
 * @param {*} match 
 */
function CodeManagementList({match}) {
  const classes = useStyles();
  const [codes, setCodes] = useState([]);
  const callSuperCodeId   = match.params.callSuperCodeId;

  /**
   * 공통코드 목록 조회
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/codem/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 공통코드 목록 조회
   */
  const searchCode = () => {
    let query = '';    
    query += 'superCodeId=' + DataExtract.getSelectedValue( document.getElementById('superCodeId')) + '&';
    query += 'code='        + document.getElementById('code').value + '&';
    query += 'codeName='    + document.getElementById('codeName').value;  
    callApi(query)
    .then(response => {
      setCodes(response.codes);
    })
    .catch(err => console.log(err));
  }; //searchCode

  /**
   * 슈퍼공통코드 창에서 상세보기 클릭했을 때 한번만 호출하는 함수
   */
  const searchCodeOnlyOnetiem = () => {
    let query = 'superCodeId=' + callSuperCodeId + '&code=&codeName=';  
    callApi(query)
    .then(response => {
      setCodes(response.codes);
    })
    .catch(err => console.log(err));
  }; //searchCode

  return (

      <Page
        className={classes.root}
        title="공통코드 관리"
      >
        <Container maxWidth={false}>
          <Header superCodeId="superCodeId" search={searchCode} />
          <SearchBar onSearch={searchCode} callSuperCodeId={callSuperCodeId} searchCodeOnlyOnetiem={searchCodeOnlyOnetiem}/>
          {codes && (
            <Results
              className={classes.results}
              codes={codes}
              search={searchCode}
            />
          )}
        </Container>
      </Page>
  );
}

export default CodeManagementList;