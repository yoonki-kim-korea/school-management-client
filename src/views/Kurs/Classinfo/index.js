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
 * 학급관리 > 신규학급 생성 및 관리
 */
function ClassinfoManagement() {
  const classes = useStyles();
  const [classinfos, setClassinfos] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/classinfo/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 신규학급 조회
   */
  const searchClassinfo = () => {
    let query = ''; 
        query += 'semester=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('semester'), '') + '&';
        query += 'department=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('department'), '') + '&';
        query += 'grade=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('grade'), '') + '&';
        query += 'classNo=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('classNo'), '') + '&';    
        query += 'classType=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('classType'), '') + '&';    
        query += 'teacher=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('teacher'), '') + '&'; 
        query += 'classroom=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('classroom'), '') + '&';

    if(document.getElementById('classStatus1').checked){
      //미배정
      query += 'classStatus=' + document.getElementById('classStatus1').value ; 
    }else if(document.getElementById('classStatus2').checked){
      //배정
      query += 'classStatus=' + document.getElementById('classStatus2').value ; 
    }else if(document.getElementById('classStatus3').checked){
      //미배정+배정
      query += 'classStatus=' + document.getElementById('classStatus3').value ; 
    }

    callApi(query)
    .then(response => {
      if(response.classinfos.length == 0){
        alert("조회할 정보가 없습니다.");
      }
      setClassinfos(response.classinfos);
    })
    .catch(err => console.log(err));
  }; //searchClassinfo

  return (
      <Page
        className={classes.root}
        title="신규학급 관리"
      >
        <Container maxWidth={false}>
          <Header search={searchClassinfo}/>
          <SearchBar onSearch={searchClassinfo}/>
          {classinfos && (
            <Results
              className={classes.results}
              classinfos={classinfos}
              search={searchClassinfo}
            />
          )}
        </Container>
      </Page>
  );
}

export default ClassinfoManagement;