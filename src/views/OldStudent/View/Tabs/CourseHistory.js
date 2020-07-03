import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import DataExtract from '../../../../utils/DataExtract';

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1150
  }
}));

/**
 * 휴학생,졸업생 관리 > 상세보기 > 수강이력 탭
 * @param {*} param0 
 */
function CourseHistory({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [courseHistory, setCourseHistory] = useState([]);

  const callApi = async (query) => {
    const url = '/api/student/class/hist?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  useEffect(() => {
    let mounted = true;

    const fetchCourseHistory = () => {
      let query = 'studentId=' + studentId;
          query += '&classType=R';
      callApi(query)
      .then(response => {
        if (mounted) {
          setCourseHistory(response.courseHistory);
        }
      })
      .catch(err => console.log(err));
    }

    fetchCourseHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Card>
        <CardHeader
          title="수강이력"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">학기</TableCell>
                    <TableCell align="center">학년</TableCell>
                    <TableCell align="left">담임</TableCell>
                    <TableCell align="center">수료여부</TableCell>
                    <TableCell align="center">시작일자</TableCell>
                    <TableCell align="center">종료일자</TableCell>
                    <TableCell align="center">중단사유</TableCell>
                    <TableCell align="left">수업료 감면사유</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseHistory.map(course => (
                    <TableRow key={course.seq}>
                      <TableCell align="center">{course.semester}</TableCell>
                      <TableCell align="center">{course.grade}</TableCell>
                      <TableCell align="left">{course.teacher}</TableCell>
                      <TableCell align="center">{course.completeYn}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(course.startDate, '-')}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(course.endDate, '-')}</TableCell>
                      <TableCell align="center">{course.abandonReason}</TableCell>
                      <TableCell align="left">{course.redunction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </div>
  );
}

CourseHistory.propTypes = {
  className: PropTypes.string
};

export default CourseHistory;
