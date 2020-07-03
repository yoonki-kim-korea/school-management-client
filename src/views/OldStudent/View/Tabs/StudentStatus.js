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

function StudentStatus({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [studentStatus, setStudentStatus] = useState([]);

  const callApi = async (query) => {
    const url = '/api/student/status/hist?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  useEffect(() => {
    let mounted = true;

    const fetchStudentStatus = () => {
      let query = 'studentId=' + studentId;
      callApi(query)
      .then(response => {
        if (mounted) {
            setStudentStatus(response.results);
        }
      })
      .catch(err => console.log(err));
    }

    fetchStudentStatus();

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
          title="휴●복학 이력"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">순번</TableCell>
                    <TableCell align="center">날짜</TableCell>
                    <TableCell align="center">상태</TableCell>
                    <TableCell align="center">휴학사유</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentStatus.map(result => (
                    <TableRow key={result.seq}>
                      <TableCell align="center">{result.seq}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(result.day, '-')}</TableCell>
                      <TableCell align="center">{result.status}</TableCell>
                      <TableCell align="center">{result.leaveAbsense}</TableCell>
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

StudentStatus.propTypes = {
  className: PropTypes.string
};

export default StudentStatus;
