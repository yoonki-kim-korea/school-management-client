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
  Button,
  Typography
} from '@material-ui/core';
import DataExtract     from '../../../../utils/DataExtract';
import TablePaginationActions from '../../../../utils/TablePaginationActions';

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
  },
  selectBox:{
    height: 42,
    width:100,
  },
  subCnt:{
    backgroundColor:'pink',
  },
  totalCnt:{
    backgroundColor:'blue'
  }
}));

/**
 * 통계 > 학기별 학급별 인원 현황
 * @param {*} param0 
 */
function Results({ className, results, search, ...rest }) {
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
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);

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
        {results.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(results.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="단위 : 명"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table  style={{width:1400}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:150}}>부서</TableCell>
                    <TableCell align="center" style={{width:150}} >학급</TableCell>
                    <TableCell align="right" >재학</TableCell>
                    <TableCell align="right" >휴학</TableCell>
                    <TableCell align="right" >졸업</TableCell>
                    <TableCell align="right" >수강중단</TableCell>
                    <TableCell align="right" >제적(휴학+졸업+졸업)</TableCell>
                    <TableCell align="right" >최초 등록(제적+수강중단)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : results
                   ).map((result, index) => (
                    <TableRow  hover key={index}>
                    {result.sid == 1 ? 
                       <>
                        <TableCell align="center" style={{background:'pink'}}>{result.department}</TableCell>
                        <TableCell align="center" style={{background:'pink'}}>{result.className}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.stdCnt}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.levCnt}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.grdCnt}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.abandonCnt}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.currentCnt}</TableCell>
                        <TableCell align="right" style={{background:'pink'}}>{result.total}</TableCell>
                       </>
                        : 
                       <>
                        <TableCell align="center">{result.department}</TableCell>
                        <TableCell align="center">{result.className}</TableCell>
                        <TableCell align="right">{result.stdCnt}</TableCell>
                        <TableCell align="right">{result.levCnt}</TableCell>
                        <TableCell align="right">{result.grdCnt}</TableCell>
                        <TableCell align="right">{result.abandonCnt}</TableCell>
                        <TableCell align="right">{result.currentCnt}</TableCell>
                        <TableCell align="right">{result.total}</TableCell>
                       </>
                    }
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
                    count={results.length}
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
  payments: PropTypes.array
};

Results.defaultProps = {
  payments: []
};

export default Results;
