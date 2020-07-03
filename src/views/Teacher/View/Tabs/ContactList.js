import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Contact/Header';
import Results from './Contact/Results';

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

function ContactList({ teacherId, className, ...rest }) {
  const classes = useStyles();
  const [contacts, setContacts] = useState([]);

  const callApi = async (query) => {
    const url = '/api/teacher/contact/list?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  useEffect(() => {
    let mounted = true;
    const fetchContactList = () => {
      let query = 'teacherId=' + teacherId ;
      callApi(query)
      .then(response => {
        if (mounted) {
            setContacts(response.results);
        }
      })
      .catch(err => console.log(err));
    }

    fetchContactList();

    return () => {
      mounted = false;
    };
  }, []);

  
  /**
   * 사용자 목록 조회
   */
  const search = () => {
    let query = 'teacherId=' + teacherId ;
    callApi(query)
    .then(response => {
      if(response.results.length == 0){
        alert('조회 결과가 없습니다.');
      }
      setContacts(response.results);
    })
    .catch(err => console.log(err));
  }; //search

  return (
    <Page
        className={classes.root}
        title="근로 계약 관리"
      >
        <Container maxWidth={false}>
        <Header teacherId={teacherId} search={search}/>
          {contacts && (
            <Results
              className={classes.results}
              contacts={contacts}
              teacherId={teacherId}
              search={search}
            />
          )}
        </Container>
      </Page>
  );
}

ContactList.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default ContactList;
