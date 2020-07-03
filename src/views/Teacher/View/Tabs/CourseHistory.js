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

function CourseHistory({ teacherId, className, ...rest }) {
  const classes = useStyles();
  const [results, setResults] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const url = '/api/teacher/course/list?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }
  
  useEffect(() => {
    let mounted = true;

    const fetchSpecialAct = () => {
      let query = 'teacherId=' + teacherId;
      callApi(query)
      .then(response => {
        if (mounted) {
          setResults(response.results);
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
        <CardHeader
          title="담임이력"
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
                    <TableCell align="center">시작일자</TableCell>
                    <TableCell align="center">종료일자</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {results.map(result => (
                  <TableRow key={result.semester}> 
                    <TableCell align="center">{result.semester}</TableCell>
                    <TableCell align="center">{result.grade}</TableCell>
                    <TableCell align="center">{DataExtract.getFommatedDate(result.startDate, '-')}</TableCell>
                    <TableCell align="center">{DataExtract.getFommatedDate(result.endDate, '-')}</TableCell>
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
