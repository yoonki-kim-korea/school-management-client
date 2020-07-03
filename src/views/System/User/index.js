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

/**
 * 사용자 관리
 * @param {*} match 
 */
function UserManagement({match}) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const userId   = match.params.userId;

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/user/list?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 사용자 목록 조회
   */
  const searchUser = () => {
    let query = '';    
    query += 'userId=' + document.getElementById('userId').value ;
    query += '&userName='    + document.getElementById('userName').value;  
    callApi(query)
    .then(response => {
      if(response.users.length == 0){
        alert('조회결과가 없습니다.')
      }
      setUsers(response.users);
    })
    .catch(err => console.log(err));
  }; //searchUser

  /**
   * 슈퍼공통코드 창에서 상세보기 클릭했을 때 한번만 호출하는 함수
   */
  const searchUserOnlyOnetiem = () => {
    let query = 'userId=' + userId ;  
    callApi(query)
    .then(response => {
      setUsers(response.users);
    })
    .catch(err => console.log(err));
  }; //searchUser

  return (

      <Page
        className={classes.root}
        title="사용자 관리"
      >
        <Container maxWidth={false}>
          <Header userId={userId} search={searchUser} />
          <SearchBar onSearch={searchUser} userId={userId} searchUserOnlyOnetiem={searchUserOnlyOnetiem}/>
          {users && (
            <Results
              className={classes.results}
              users={users}
              search={searchUser}
            />
          )}
        </Container>
      </Page>
  );
}

export default UserManagement;