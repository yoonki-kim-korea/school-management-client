import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Container,
  Tabs,
  Tab,
  Divider,
  colors
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import BasicInfo from './Tabs';
import CourseHistory from './Tabs/CourseHistory';
import ContactList from './Tabs/ContactList';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  tabs: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

function TeacherView({ match, history }) {
  const classes = useStyles();
  const { teacherId, tab: currentTab } = match.params;
  const tabs = [
    { value: 'basicInfo',       label: '기본정보' },
    { value: 'contactList',     label: '근로계약관리' },
    { value: 'courseHistory',   label: '담임이력' }
  ];

  const handleTabsChange = (event, value) => {
    history.push(value);
  };
  
  if (!currentTab) {
    return <Redirect to={`/teacher/view/${teacherId}/basicInfo`} />;
  }

  if (!tabs.find((tab) => tab.value === currentTab || !teacherId)) {
    return <Redirect to="/errors/error-404" />;
  }

  return (
    <Page
      className={classes.root}
      title="교직원 상세 정보"
    >
      <Container maxWidth={false}>
        <Header />
        <Tabs
          className={classes.tabs}
          onChange={handleTabsChange}
          scrollButtons="auto"
          value={currentTab}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider className={classes.divider} />
        <div className={classes.content}>
          {currentTab === 'basicInfo' && <BasicInfo teacherId={teacherId} />}
          {currentTab === 'contactList' && <ContactList teacherId={teacherId}  />}
          {currentTab === 'courseHistory' && <CourseHistory teacherId={teacherId}  />}
        </div>
      </Container>
    </Page>
  );
}

TeacherView.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default TeacherView;
