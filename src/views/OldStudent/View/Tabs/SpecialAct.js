import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
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
  },
  methodCell: {
    width: 100
  },
  statusCell: {
    width: 64
  }
}));

/**
 * 휴학, 졸업생관리 > 상세보기 > 특별활동내역 탭
 * @param {*} param0 
 */
function SpecialAct({ studentId, className, ...rest }) {
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

    const fetchSpecialAct = () => {
      let query = 'studentId=' + studentId;
          query += '&classType=E'
      callApi(query)
      .then(response => {
        if (mounted) {
          setCourseHistory(response.courseHistory);
        }
      })
      .catch(err => console.log(err));
    }

    fetchSpecialAct();

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
        <CardHeader title="특별활동" />
        <Divider />
        <CardContent className={classes.content}>
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
        </CardContent>
      </Card>
    </div>
  );
}

SpecialAct.propTypes = {
  className: PropTypes.string
};

export default SpecialAct;
