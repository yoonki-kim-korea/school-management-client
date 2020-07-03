import React, { useState } from 'react';
import {post} from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles, makeStyles } from '@material-ui/styles';
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
  Button
} from '@material-ui/core';
import Proxy       from '../../../../utils/Proxy';
import DataExtract     from '../../../../utils/DataExtract';
import CommonCode     from '../../../../utils/CommonCode';
import TablePaginationActions from '../../../../utils/TablePaginationActions';
import Tooltip from "@material-ui/core/Tooltip";

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
    width:120,
  },
}));

/**
 * 수업료 납부
 * @param {*} param0 
 */
function Results({ className, payments, search, ...rest }) {
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
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, payments.length - page * rowsPerPage);

  /**
   * 학생기본정보의 입학금 저장
   * @param {*} event 
   * @param {*} studentId 
   */
  const saveAdmission = (event, studentId) => {
    const url = "/api/student/admission/update";
    const formData = new FormData();
    formData.append('studentId', studentId);  
    //금액을 코드에 넣어 공통코드에 저장하다 보니 할 수없이 금액 뒤에 가비자값으로 구분함여 | 문자 로 잘라서 금액을 가져옴.
    formData.append('admission', event.target.value.split("|")[0]); 
    formData.append('updId', "root");
   
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
    
  /**
   * 납부 저장
   * @param {*} method 
   * @param {*} studentId 
   * @param {*} applyYear 
   * @param {*} applyMonth 
   * @param {*} schoolFeeStatus 
   * @param {*} schoolfeeType 
   * @param {*} fee 
   * @param {*} index 
   */
  const save = (method, studentId, applyYear, applyMonth, schoolFeeStatus, schoolfeeType, fee, index) => {
    const url =  (method === 'save') ? '/api/payment/save' : '/api/payment/update';
    const formData = new FormData();
    formData.append('studentId', studentId);      
    formData.append('applyYear', applyYear);  
    formData.append('applyMonth', applyMonth);  
    formData.append('schoolFeeStatus', schoolFeeStatus);  
    formData.append('schoolfeeType', schoolfeeType);  
    formData.append('schoolFee', fee);   
    formData.append((method === 'save') ? 'creId' : 'udtId', 'root');  
   
    const config = {
        headers : { 'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
    post(url, formData, config, Response)
      .then(response => {
        if(response.data.result === "success"){   
          //납부 상테에 때라 셀렉트 박스의 색상을 변경한다.
          let select = document.getElementById(`${studentId + '-' + applyYear + '-' + applyMonth + '-' + index}`);
          if(select) {
            if(DataExtract.getSelectedValue(select) != ""){
              select.style.backgroundColor = "yellow"; 
            }else{
              select.style.backgroundColor = "grey"; 
            } 
          }    
          console.log('수정 성공');
        }else{
          alert(`${applyYear}년 ${applyMonth}월 수업료 납부 저장 실패`);
        }
    });
  }

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
        {payments.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(payments.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader title="전체 납부 대상 학생" />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table  style={{width:2300}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" style={{width:120}}>                                           
                      <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"한글성명"}</b><br/>          
                              <b>{"학번"}</b><br/>          
                              <b>{"재학/휴학/졸업"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>학생</u></Button>
                      </HtmlTooltip>
                    </TableCell>
                    <TableCell align="left" style={{width:160}}>입학일</TableCell>
                    <TableCell align="left" style={{width:120}}>                                            
                      <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"입학시 입학금 납입여부. 납입증명서 발행시 필요"}</b><br/>          
                              <b>{"완납:100Euro"}</b><br/>          
                              <b>{"3자녀, 교사자녀 등 할인 적용"}</b><br/>          
                              <b>{"현재 수강중인 정규수업에만 표시"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>입학금</u></Button>
                      </HtmlTooltip>
                    </TableCell>
                    <TableCell align="left" style={{width:170}}>                      
                      <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"학기"}</b><br/>          
                              <b>{"부서"}</b><br/>          
                              <b>{"학년, 반"}</b><br/>          
                              <b>{"수업료에 의한 수업유형"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>과정</u></Button>
                      </HtmlTooltip>
                    </TableCell>
                    <TableCell align="left" style={{width:120}}>감면사유</TableCell>
                    <TableCell align="left" style={{width:210}}>
                      <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">                            
                            <b>{"시작일"}{'~'}{'종료일'}</b><br/>
                              <b>{"중단사유"}</b>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>수강상태</u></Button>
                      </HtmlTooltip>
                    </TableCell>
                    <TableCell align="center" className={classes.tableMonth}>1월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>2월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>3월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>4월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>5월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>6월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>7월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>8월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>9월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>10월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>11월</TableCell>
                    <TableCell align="center" className={classes.tableMonth}>12월</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : payments
                   ).map((payment, index) => (
                    <TableRow
                      hover
                      key={payment.studentId + '-' + index}
                    >
                      <TableCell align="left">{payment.koreanName}<br/>({payment.studentNo})<br/>{payment.studentStatusName}</TableCell>
                      <TableCell align="left">{DataExtract.getFommatedDate(payment.entranceDay, '-')}</TableCell>

                      <TableCell align="left">
                        {/** 현재 수강중인 정규수업인 경우에만 입학금 납입여부 콤보박스를 보여준다. */}
                        {payment.schoolfeeType === 'RE' && payment.classId === payment.lastClassId ?
                          <select name="classNo" id="classNo" className={classes.selectBox}
                            onChange={(event)=>{ saveAdmission(event, payment.studentId)}}
                          >
                            <CommonCode superCode="ADMISSION_FEE" placeHolder="입학금" selectedValue={payment.admissionFee} firstSelectYn="Y"/>
                          </select>
                          :
                          ''}
                      </TableCell>
                      <TableCell align="left">{payment.semesterName}<br/>{payment.departmentName}<br/>{payment.className}<br/>{payment.schoolfeeTypeName}</TableCell>                      
                      <TableCell align="left">{payment.reductionTypeName}</TableCell>                     
                      <TableCell align="left">
                        {DataExtract.getFommatedDate(payment.classStartDate, '-') + '~'}<br/> {DataExtract.getFommatedDate(payment.classEndDate, '-')}<br/>{payment.abandonReasonName !== ''? payment.abandonReasonName : ''}
                      </TableCell>  

                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee01, payment.com01, payment.pay01, save, payment.studentId, payment.applyYear, '01', payment.schoolfeeType, index)}</TableCell>                      
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee02, payment.com02, payment.pay02, save, payment.studentId, payment.applyYear, '02', payment.schoolfeeType, index)}</TableCell>                      
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee03, payment.com03, payment.pay03, save, payment.studentId, payment.applyYear, '03', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee04, payment.com04, payment.pay04, save, payment.studentId, payment.applyYear, '04', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee05, payment.com05, payment.pay05, save, payment.studentId, payment.applyYear, '05', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee06, payment.com06, payment.pay06, save, payment.studentId, payment.applyYear, '06', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee07, payment.com07, payment.pay07, save, payment.studentId, payment.applyYear, '07', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee08, payment.com08, payment.pay08, save, payment.studentId, payment.applyYear, '08', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee09, payment.com09, payment.pay09, save, payment.studentId, payment.applyYear, '09', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee10, payment.com10, payment.pay10, save, payment.studentId, payment.applyYear, '10', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee11, payment.com11, payment.pay11, save, payment.studentId, payment.applyYear, '11', payment.schoolfeeType, index)}</TableCell>
                      <TableCell align="center" className={classes.tableMonth}>{DataExtract.payment(payment.fee12, payment.com12, payment.pay12, save, payment.studentId, payment.applyYear, '12', payment.schoolfeeType, index)}</TableCell>
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
                    count={payments.length}
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
