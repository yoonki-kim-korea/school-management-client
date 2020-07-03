import React, { useState } from 'react';
import {post} from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  TableFooter,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import SchoolfeeUpdateModal from './SchoolfeeUpdateModal';
import Proxy       from '../../../utils/Proxy';
import TablePaginationActions from '../../../utils/TablePaginationActions';
import SpecialCommonCode from '../../../utils/SpecialCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  selectBox:{
    height: 42,
    width:120,
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
}));

function Results({ className, schoolfees, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [openEdit, setOpenEdit] = useState(false);
  const [editable, setEditable]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, schoolfees.length - page * rowsPerPage);
  
  const handleEditOpen = (schoolfee) => {
    if(schoolfee.paymentCount > 0 && !window.confirm(`${schoolfee.paymentCount}명의 납입한 학생이 있습니다. ${schoolfee.applyYear}년 ${schoolfee.applyMonthName} 납입한 학생들의 입금액이 모두 변경됩니다. 계속 진행하시겠습니까?`)){
        return;
    }
    setOpenEdit(true);    
    setEditable(schoolfee);
  }

  const updateModalClose = () => {
    setOpenEdit(false); 
  }

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * 수업료 삭제
   * @param {*} user 
   */
  const deleteCode = (schoolfee) => {
    if(schoolfee.paymentCount > 0){
        alert(`${schoolfee.paymentCount}명의 납입한 학생이 있으므로 삭제할 수 없습니다.`);
        return;
    }

    if(!window.confirm(`${schoolfee.applyYear}년 ${schoolfee.applyMonthName}을 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/schoolfee/delete';
    const formData = new FormData();
    formData.append('applyYear', schoolfee.applyYear);  
    formData.append('applyMonth', schoolfee.applyMonth);  
   
    const config = {
        headers : { 'content-type' : 'multipart/form-data' },
        proxy: Proxy.ProxyConfig
    }
    post(url, formData, config, Response)
      .then(response => {
        if(response.data.result === "success"){            
          alert('삭제 성공');
          search();
        }else{
          alert('삭제 실패');
        }
    });
  }//deleteSuperCode

  /**
   * 적용학기 수정
   * @param {*} applyYear 
   * @param {*} applyMonth 
   * @param {*} value 
   */
  const save = (applyYear, applyMonth, value) => {
    const url = '/api/schoolfee/semester/update';
    const formData = new FormData();
      
    formData.append('applyYear', applyYear);  
    formData.append('applyMonth', applyMonth);  
    formData.append('semesterId', value);
    formData.append('udtId', 'root');  
   
    const config = {
        headers : { 'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
    post(url, formData, config, Response)
      .then(response => {
        if(response.data.result === "success"){            
          console.log('수정 성공');
        }else{
          console.log('수정 실패');
        }
    });
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**수업료 수정 모달팝업 */}                   
        <SchoolfeeUpdateModal
          onClose={updateModalClose}
          open={openEdit}
          editable={editable}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {schoolfees.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(schoolfees.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="월별 적용 목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:150}}>적용학기</TableCell>
                    <TableCell align="center">적용연월</TableCell>
                    <TableCell align="center">정규수업<br/>수업료</TableCell>
                    <TableCell align="center">비정규수업<br/>수업료1</TableCell>
                    <TableCell align="center">비정규수업<br/>수업료2</TableCell>
                    <TableCell align="center">정규수업<br/>수업료 할인</TableCell>
                    <TableCell align="center">비정규수업<br/>수업료1 할인</TableCell>
                    <TableCell align="center">비정규수업<br/>수업료2 할인</TableCell>
                    <TableCell align="center">납입자<br/>여부</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? schoolfees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : schoolfees
                   ).map((schoolfee) => (
                    <TableRow
                      hover
                      key={schoolfee.applyYear + schoolfee.applyMonth}
                    >
                      <TableCell align="center">
                        <select className={classes.selectBox}                          
                          onChange={(event)=>{save(schoolfee.applyYear, schoolfee.applyMonth, event.target.value)}} >  
                        >       
                          <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="Y" selectedValue={schoolfee.semesterId}/>                
                        </select>

                      </TableCell>
                      <TableCell align="center">{schoolfee.applyYear + '년 ' + schoolfee.applyMonthName}</TableCell>
                      <TableCell align="right">{schoolfee.regularSchoolFee}</TableCell>
                      <TableCell align="right">{schoolfee.extraSchoolFee1}</TableCell>
                      <TableCell align="right">{schoolfee.extraSchoolFee2}</TableCell>
                      <TableCell align="right">{schoolfee.regularSchoolFeeDiscount}</TableCell>
                      <TableCell align="right">{schoolfee.extraSchoolFee1Discount}</TableCell>
                      <TableCell align="right">{schoolfee.extraSchoolFee2Discount}</TableCell>
                      <TableCell align="center">{schoolfee.paymentCount>0 ? <b>있음</b> : ""}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(schoolfee)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteCode(schoolfee)}
                        > 삭제
                        </Button>      
                        </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={schoolfees.length}
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
  schoolfees: PropTypes.array
};

Results.defaultProps = {
  schoolfees: []
};

export default Results;
