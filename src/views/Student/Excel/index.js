import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import ExcelPage from './ExcelPage';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function StudentManagementList() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="학생 엑셀 업로드"
    >
      <Container maxWidth={false}>
        <Header />        
        <ExcelPage />
      </Container>
    </Page>
  );
}

export default StudentManagementList;