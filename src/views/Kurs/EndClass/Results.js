import React, { useState } from 'react';
import {post} from 'axios';
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
  TableFooter,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import Proxy       from '../../../utils/Proxy';
import ExcelInfo     from '../../../utils/ExcelInfo';
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
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
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
function Results({ className, classinfos, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);  
  const handleChangePage = (event, page) => {
    setPage(page);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, classinfos.length - page * rowsPerPage);
  
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
        {classinfos.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(classinfos.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 학급"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">학기</TableCell>
                    <TableCell align="center">부서</TableCell>
                    <TableCell align="center">학년</TableCell>
                    <TableCell align="center">반</TableCell>
                    <TableCell align="center">시간구분</TableCell>
                    <TableCell align="center">유형</TableCell>
                    <TableCell align="center">교실</TableCell>
                    <TableCell align="center">담임</TableCell>
                    <TableCell align="center">정원</TableCell>
                    <TableCell align="center">재적</TableCell>
                    <TableCell align="center">학생목록</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? classinfos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : classinfos
                   ).map((classinfo) => (
                    <TableRow
                      hover
                      key={classinfo.classinfoId}
                    >
                      <TableCell align="center">{classinfo.semesterName}</TableCell>
                      <TableCell align="center">{classinfo.departmentName}</TableCell>
                      <TableCell align="center">{classinfo.gradeName}</TableCell>
                      <TableCell align="center">{classinfo.classNoName}</TableCell>
                      <TableCell align="center">{classinfo.classTimeName}</TableCell>
                      <TableCell align="center">{classinfo.classTypeName}</TableCell>
                      <TableCell align="center">{classinfo.classroomName}</TableCell>
                      <TableCell align="center">{classinfo.teacherName}</TableCell>
                      <TableCell align="center">{classinfo.classCapacity}</TableCell>
                      <TableCell align="center">{classinfo.classAssign}</TableCell>
                      <TableCell align="center">  
                        <Button
                          color="primary"
                          component={RouterLink}
                          to={"/kurs/endclass/view/" + classinfo.classId + "/" + classinfo.classType}
                          variant="outlined"
                        >
                          학생 목록
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={15} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={classinfos.length}
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
  classinfos: PropTypes.array
};

Results.defaultProps = {
  classinfos: []
};

export default Results;
