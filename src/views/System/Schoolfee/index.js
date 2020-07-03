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
 * 수업료 관리
 * @param {*} match 
 */
function SchoolfeeManagement({match}) {
  const classes = useStyles();
  const [schoolfees, setSchoolfees] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/schoolfee/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 수업료 목록 조회
   */
  const searchSchoolfees = () => {
    if(!DataExtract.getSelectedValue(document.getElementById('applyYear'))) {
      alert("적용연도를 선택해야 합니다.");
      return;
    }
    let query = '';    
        query += 'applyYear=' + DataExtract.getSelectedValue(document.getElementById('applyYear'));
    callApi(query)
    .then(response => {
      if(response.schoolfees.length == 0){
        alert(`${DataExtract.getSelectedValue(document.getElementById('applyYear'))}년도에 등록된 수업료 정보가 없습니다.`)
      }
      setSchoolfees(response.schoolfees);
    })
    .catch(err => console.log(err));
  }; //searchSchoolfees
  

  return (

      <Page
        className={classes.root}
        title="수업료 관리"
      >
        <Container maxWidth={false}>
          <Header  search={searchSchoolfees} />
          <SearchBar onSearch={searchSchoolfees}  />
          {schoolfees && (
            <Results
              className={classes.results}
              schoolfees={schoolfees}
              search={searchSchoolfees}
            />
          )}
        </Container>
      </Page>
  );
}

export default SchoolfeeManagement;