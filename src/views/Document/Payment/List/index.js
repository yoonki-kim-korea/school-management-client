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
 * 수업료 납부
 * @param {*} match 
 */
function SchoolfeeManagement() {
  const classes = useStyles();
  const [payments, setSchoolfees] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/payment/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 수업료 목록  조회
   */
  const searchSchoolfee = () => {
    
    if(!DataExtract.getSelectedValue(document.getElementById('applyYear'))) {
      alert("적용연도를 선택해야 합니다.");
      return;
    }
    document.getElementById('searchBtn').innerHTML = "조회 중...";
    
    let query  = ''; 
        query += 'applyYear='        + DataExtract.getSelectedValueWithAlternative( document.getElementById('applyYear'), '');
        query += '&semesterId='      + DataExtract.getSelectedValueWithAlternative( document.getElementById('semesterId'), '');
        query += '&department='      + DataExtract.getSelectedValueWithAlternative( document.getElementById('department'), '');
        query += '&grade='           + DataExtract.getSelectedValueWithAlternative( document.getElementById('grade'), '');
        query += '&classNo='         + DataExtract.getSelectedValueWithAlternative( document.getElementById('classNo'), ''); 
        query += '&teacherId='       + DataExtract.getSelectedValueWithAlternative( document.getElementById('teacherId'), '');
        query += '&schoolFeeType='   + DataExtract.getSelectedValueWithAlternative( document.getElementById('schoolFeeType'), '');
        query += '&studentStatus='   + DataExtract.getSelectedValueWithAlternative( document.getElementById('studentStatus'), '');
        query += '&studentName='     + document.getElementById('studentName').value;
        query += '&studentNo='       + document.getElementById('studentNo').value;
       
    callApi(query)
    .then(response => {
      document.getElementById('searchBtn').innerHTML = "검색";
      if(response.payments.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setSchoolfees(response.payments);
    })
    .catch(err => console.log(err));
  }; //searchSchoolfee

  return (
      <Page
        className={classes.root}
        title="수업료 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchSchoolfee}/>
          <SearchBar onSearch={searchSchoolfee}/>
          {payments && (
            <Results
              className={classes.results}
              payments={payments}
              search={searchSchoolfee}
            />
          )}
        </Container>
      </Page>
  );
}

export default SchoolfeeManagement;