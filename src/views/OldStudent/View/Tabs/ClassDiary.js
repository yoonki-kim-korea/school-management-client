import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import SearchBar from '../../../Kurs/OperClass/Diary/SearchBar';
import Header from '../../../Kurs/OperClass/Diary/Header';
import Results from '../../../Kurs/OperClass/Diary/Results';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

function ClassDiary({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [diarys, setDiarys] = useState([]);

  const callApi = async (query) => {
    const url = '/api/diary/list?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  useEffect(() => {
    let mounted = true;
    const fetchClassDiary = () => {
      let query = '';    
      query += 'studentId=' + studentId ;
      callApi(query)
      .then(response => {
        if (mounted) {
          setDiarys(response.diarys);
        }
      })
      .catch(err => console.log(err));
    }

    fetchClassDiary();

    return () => {
      mounted = false;
    };
  }, []);

  
  /**
   * 사용자 목록 조회
   */
  const searchUser = () => {
    let query = '';    
    query += 'studentId=' + studentId ;
    query += '&content='    + document.getElementById('content').value;  
    callApi(query)
    .then(response => {
      if(response.diarys.length == 0){
        alert('조회 결과가 없습니다.');
      }
      setDiarys(response.diarys);
    })
    .catch(err => console.log(err));
  }; //searchUser

  return (
    <Page
        className={classes.root}
        title="학생별 메모 관리"
      >
        <Container maxWidth={false}>
          <Header studentId={studentId} search={searchUser} />
          <SearchBar onSearch={searchUser} style={{height:80}}/>
          {diarys && (
            <Results
              className={classes.results}
              diarys={diarys}
              studentId={studentId}
              search={searchUser}
            />
          )}
        </Container>
      </Page>
  );
}

ClassDiary.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default ClassDiary;
