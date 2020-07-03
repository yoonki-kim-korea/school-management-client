import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
  Link
} from '@material-ui/core';
import DataExtract from '../../../utils/DataExtract';
import TablePaginationActions from '../../../utils/TablePaginationActions';

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
}));

function Results({ className, students, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        전체
        {' '}
        {students.length}
        {' '}
        명. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(students.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 학생"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">학번</TableCell>
                    <TableCell align="left">한글성명</TableCell>
                    <TableCell align="left">독어성명</TableCell>
                    <TableCell align="left">생년월일</TableCell>
                    <TableCell align="left">입학일</TableCell>
                    <TableCell align="left">상태</TableCell>
                    <TableCell align="left">현재학년</TableCell>
                    <TableCell align="left">담임</TableCell>
                    <TableCell align="left">부모</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : students
                   ).map((student) => (
                    <TableRow
                      hover
                      key={student.studentId}
                    >
                      <TableCell align="center">                        
                        <Link
                          className={classes.link}
                          color="primary"
                          href={"/student/view/" + student.studentId + "/basicInfo"}
                          target="_self"
                        >
                          <u>{student.studentNo}</u>
                        </Link>                        
                      </TableCell>
                      <TableCell align="left">{student.koreanName}</TableCell>
                      <TableCell align="left">{student.germanName}</TableCell>
                      <TableCell align="left">{DataExtract.getFommatedDate(student.birthday,'-')}</TableCell>
                      <TableCell align="left">{DataExtract.getFommatedDate(student.entranceDay,'-')}</TableCell>
                      <TableCell align="left">{student.studentStatusName}</TableCell>
                      <TableCell align="left">{student.currentSemester}</TableCell>
                      <TableCell align="left">{student.classTeacher}</TableCell>
                      <TableCell align="left">{student.fatherName}, {student.motherName}</TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={students.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
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
