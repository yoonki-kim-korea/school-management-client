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
import PaymentModal from './modals/PaymentModal';
import ContributionModal from './modals/ContributionModal';
import Proxy       from '../../../../utils/Proxy';
import DataExtract       from '../../../../utils/DataExtract';
import ExcelInfo     from '../../../../utils/ExcelInfo';
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
  }
}));

/**
 * 수업료 납부현황
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
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [payment, setPayment] = useState(false);
  const [issued, setIssued] = useState(false);
  const [documentInfo, setDocumentInfo] = useState(false);
  
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }

  
  /**
   * 문서 정보 조회
   */
  const getDocumentInfo = async (query, issued, payment, val) => {      
    let documentInfo;
      await callApi(query)
      .then(response => {
        if(response.documents.length == 0){
          console.log(`문서정보 조회 실패.`);
        }        
        documentInfo = response.documents;
        setDocumentInfo(documentInfo);
        setIssued(issued);         
        setPayment(payment);  
        switch(val){
          case 1: setOpenModal(true); break;//납입증명서
          case 2: setOpenModal2(true); break;//기부금영수증
        }       
      })
      .catch(err => console.log(err));
      return documentInfo;
  }
  
  /**
   * 납입증명서 모달 호출
   * @param {*} payment 
   */
  const handleOpenModal = (payment) => {
    let query = '/api/issued/new?documentType=P&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=PAYMENT_PROOF`, response.results[0], payment, 1);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  
  /**
   * 기부금 영수증 출력 모달
   * @param {*} payment 
   */
  const contributionOpenModal = (payment) => {
    let query = '/api/issued/new?documentType=C&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=CONTRIBUTION`, response.results[0], payment, 2);
    })  
    .catch((err) => {
        console.log(err);
    });
  } 

  /**
   * 납입증명서 모달 닫기
   */
  const handleCloseModal = () => {
    setOpenModal(false); 
  }
  /**
   * 기부금영수증 모달 닫기
   */
  const handleCloseModal2 = () => {
    setOpenModal2(false); 
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    > 

        {/** 납입증명서 모달팝업 */}        
        <PaymentModal
          onClose={handleCloseModal}
          open={openModal}
          payment={payment}
          issued={issued}
          documentInfo={documentInfo}
          search={search}
        />

        {/** 기부금영수증 모달팝업 */}        
        <ContributionModal
          onClose={handleCloseModal2}
          open={openModal2}
          payment={payment}
          issued={issued}
          documentInfo={documentInfo}
          search={search}
        />

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
        <CardHeader
          title="납부 대상 학생 목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table style={{width:1500}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" rowSpan="2">학번</TableCell>
                    <TableCell align="left" rowSpan="2">학생명</TableCell>
                    <TableCell align="left" rowSpan="2">최종학년</TableCell>
                    <TableCell align="left" rowSpan="2">담임</TableCell>
                    <TableCell align="right" rowSpan="2">입학금</TableCell>
                    <TableCell align="right" rowSpan="2">과정갯수</TableCell>
                    <TableCell align="center" colSpan="4">정규수업</TableCell>
                    <TableCell align="center" colSpan="4">비정규수업</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">수업료</TableCell>
                    <TableCell align="right">납부액</TableCell>
                    <TableCell align="right">잔액</TableCell>
                    <TableCell align="center">납입증명서</TableCell>

                    <TableCell align="right">수업료</TableCell>
                    <TableCell align="right">납부액</TableCell>
                    <TableCell align="right">잔액</TableCell>
                    <TableCell align="center">기부금 영수증</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : payments
                   ).map((payment) => (
                    <TableRow
                      hover
                      key={payment.studentId}
                    >
                      <TableCell align="left">{payment.studentNo}</TableCell>
                      <TableCell align="left">{payment.koreanName}</TableCell>
                      <TableCell align="left">{payment.semesterName} {payment.departmentName} {payment.gradeName} {payment.classNoName}</TableCell>
                      <TableCell align="left">{payment.teacherName}</TableCell>
                      <TableCell align="right">{payment.admissionFee}</TableCell>
                      <TableCell align="right">{payment.courseCount}</TableCell>

                      <TableCell align="right">{DataExtract.money(payment.fee1)}</TableCell>
                      <TableCell align="right">{DataExtract.money(payment.pay1)}</TableCell>
                      <TableCell align="right">{DataExtract.money(payment.balance1)}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleOpenModal(payment)}
                        > 납입증명서
                        </Button> 
                      </TableCell>
                      
                      <TableCell align="right">{DataExtract.money(payment.fee2)}</TableCell>
                      <TableCell align="right">{DataExtract.money(payment.pay2)}</TableCell>
                      <TableCell align="right">{DataExtract.money(payment.balance2)}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => contributionOpenModal(payment)}
                        > 기부금 영수증
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
