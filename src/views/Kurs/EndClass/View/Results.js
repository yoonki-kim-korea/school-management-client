import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBox:{
    height: 42,
    width:120,
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

/**
 * 학급관리 > 종료학급관리
 * @param {*} param0 
 */
function Results({ className, students, search,  ...rest }) {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >        
       
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체{' '}{students.length}{' 명'}
      </Typography>
      <Card>
        <CardHeader
          title="종료학급 학생목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>학번</TableCell>
                    <TableCell>한글성명</TableCell>
                    <TableCell>수료여부</TableCell>
                    <TableCell>감면사유</TableCell>
                    <TableCell align="center">메모</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow
                      hover
                      key={student.studentId}
                    >
                      <TableCell>{student.studentNo}</TableCell>
                      <TableCell>{student.koreanName}</TableCell>
                      <TableCell>{student.completeYnName}</TableCell>
                      <TableCell>{student.reductionName}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"                          
                          component={RouterLink}
                          to={"/kurs/diary/list/" + student.studentId}
                        > 메모
                        </Button> 
                      </TableCell>
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

Results.propTypes = {
  className: PropTypes.string,
  students: PropTypes.array
};

Results.defaultProps = {
  students: []
};

export default Results;
