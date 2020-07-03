import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles, makeStyles } from '@material-ui/styles';
import Tooltip from "@material-ui/core/Tooltip";
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

/**
 * 툴팁에 적용되는 스타일
 */
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 240,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

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
        <CardHeader/>
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table  style={{width:850}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:150}}>시간 구분</TableCell>
                    <TableCell align="center" style={{width:150}}>학생 분류</TableCell>
                    <TableCell align="right" style={{width:150}}>학생 수</TableCell>
                    <TableCell align="right"  style={{width:200}}>수업료</TableCell>
                    <TableCell align="right"  style={{width:200}}>
                      <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"학생수 * 한달 수업료"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>총수업료</u></Button>
                      </HtmlTooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : results
                   ).map((result, index) => (
                    <TableRow  hover key={index}>
                       {result.ord == 1 ? 
                          <>
                            <TableCell align="center" colSpan="2" style={{background:'pink'}}>{result.tp}</TableCell>
                            <TableCell align="right" style={{background:'pink'}}>{result.total}</TableCell>
                            <TableCell align="right" style={{background:'pink'}}>{result.fee}</TableCell>
                            <TableCell align="right" style={{background:'pink'}}>{result.totalFee}</TableCell>
                          </>
                           : 
                          <>
                            <TableCell align="center">{result.ctime}</TableCell>
                            <TableCell align="center">{result.tp}</TableCell>
                            <TableCell align="right">{result.total}</TableCell>
                            <TableCell align="right">{result.fee}</TableCell>
                            <TableCell align="right">{result.totalFee}</TableCell>
                          </>
                       }                     
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
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
