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
import BasicAndFamilyInfo from './Tabs';
import CourseHistory from './Tabs/CourseHistory';
import SpecialAct from './Tabs/SpecialAct';
import DocumentHistory from './Tabs/DocumentHistory';
import ClassDiary from './Tabs/ClassDiary';
import StudentStatus from './Tabs/StudentStatus';

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

function StudentView({ match, history }) {
  const classes = useStyles();
  const { studentId, tab: currentTab } = match.params;
  const tabs = [
    { value: 'basicInfo',       label: '기본정보' },
    { value: 'courseHistory',   label: '수강이력' },
    { value: 'specialAct',      label: '특별활동' },
    { value: 'documentHistory', label: '문서발급이력' },
    { value: 'classDiary',      label: '메모' },
    { value: 'studentStatus',      label: '휴●복학' }
  ];

  const handleTabsChange = (event, value) => {
    history.push(value);
  };
  
  if (!currentTab) {
    return <Redirect to={`/student/view/${studentId}/basicInfo`} />;
  }

  if (!tabs.find((tab) => tab.value === currentTab || !studentId)) {
    return <Redirect to="/errors/error-404" />;
  }

  return (
    <Page
      className={classes.root}
      title="학생 상세 정보"
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
          {currentTab === 'basicInfo' && <BasicAndFamilyInfo studentId={studentId} />}
          {currentTab === 'courseHistory' && <CourseHistory studentId={studentId}  />}
          {currentTab === 'specialAct' && <SpecialAct studentId={studentId}  />}
          {currentTab === 'documentHistory' && <DocumentHistory studentId={studentId}  />}
          {currentTab === 'classDiary' && <ClassDiary studentId={studentId}  />}
          {currentTab === 'studentStatus' && <StudentStatus studentId={studentId}  />}
        </div>
      </Container>
    </Page>
  );
}

StudentView.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default StudentView;
