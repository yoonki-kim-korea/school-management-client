import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import Header from './Header';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 로그인 후 첫화면
 */
function Presentation() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="프랑크푸르트 한국학교 학사관리 시스템 메인화면"
    >
      <Header />
    </Page>
  );
}

export default Presentation;
