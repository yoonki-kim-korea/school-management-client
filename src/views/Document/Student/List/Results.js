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
import LeaveAbsenseModal from './modals/LeaveAbsenseModal';
import ReturnModal from './modals/ReturnModal';
import GraduateModal from './modals/GraduateModal';
import EnrollmentModal from './modals/EnrollmentModal';
import EntranceModal from './modals/EntranceModal';
import AttendanceModal from './modals/AttendanceModal';
import GraduateDocModal from './modals/GraduateDocModal';
import PrizeModal from './modals/PrizeModal';
import RegularModal from './modals/RegularModal';

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
}));

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

  const [openEdit, setOpenEdit] = useState(false);  //휴학
  const [openEdit2, setOpenEdit2] = useState(false);//복학
  const [openEdit3, setOpenEdit3] = useState(false);//졸업
  const [openEdit4, setOpenEdit4] = useState(false);//재학증명서
  const [openEdit5, setOpenEdit5] = useState(false);//입학통지서
  const [openEdit6, setOpenEdit6] = useState(false);//개근상장
  const [openEdit7, setOpenEdit7] = useState(false);//졸업장
  const [openEdit8, setOpenEdit8] = useState(false);//정근상장
  const [openEdit9, setOpenEdit9] = useState(false);//상장
  const [editable, setEditable]= useState(false);
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
   * 휴학
   * @param {*} editable 
   */
  const leaveAbsenseOpen = (editable) => {
    setOpenEdit(true);    
    setEditable(editable);
  }

  const leaveAbsenseClose = () => {
    setOpenEdit(false); 
  }

  /**
   * 복학
   * @param {*} editable 
   */
  const returnOpen = (editable) => {
    setOpenEdit2(true);    
    setEditable(editable);
  }

  const returnClose = () => {
    setOpenEdit2(false); 
  }

  /**
   * 졸업
   * @param {*} editable 
   */
  const graduateOpen = (editable) => {
    setOpenEdit3(true);    
    setEditable(editable);
  }

  const graduateClose = () => {
    setOpenEdit3(false); 
  }

  /**
   * 재학증명서 모달 호출
   * @param {*} editable 
   */
  const enrollmentOpen = (editable) => {
    let query = '/api/issued/new?documentType=E&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=ENROLLMENT`, response.results[0], editable, 4);
    })  
    .catch((err) => {
        console.log(err);
    });
  }

  const enrollmentClose = () => {  
    setOpenEdit4(false);
  }

  /**
   * 입학통지서 모달 호출
   * @param {*} editable 
   */
  const entranceOpen = (editable) => {
    let query = '/api/issued/new?documentType=T&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=ENTRANCE`, response.results[0], editable, 5);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  const entranceClose = () => {  
    setOpenEdit5(false);
  }

  /**
   * 개근상장
   * @param {*} editable 
   */
  const attendanceOpen = (editable) => {
    let query = '/api/issued/new?documentType=A&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=ATTENDANCE`, response.results[0], editable, 6);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  const attendanceClose = () => {  
    setOpenEdit6(false);
  }  

  /**
   * 정근상장
   * @param {*} editable 
   */
  const regualarOpen = (editable) => {
    let query = '/api/issued/new?documentType=R&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=REGULAR`, response.results[0], editable, 8);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  const regularClose = () => {  
    setOpenEdit8(false);
  }

  /**
   * 졸업장
   * @param {*} editable 
   */
  const graduateDocOpen = (editable) => {
    let query = '/api/issued/new?documentType=G&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=GRADUATE`, response.results[0], editable, 7);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  const graduateDocClose = () => {  
    setOpenEdit7(false);
  }

  /**
   * 상장
   * @param {*} editable 
   */
  const prizeOpen = (editable) => {
    let query = '/api/issued/new?documentType=Z&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=PRIZE`, response.results[0], editable, 9);
    })  
    .catch((err) => {
        console.log(err);
    });
  }
  const prizeClose = () => {  
    setOpenEdit9(false);
  }
  
  /**
   * 문서 정보 조회
   */
  const getDocumentInfo = async (query, issued, editable, val) => {      
    let documentInfo;
      await callApi(query)
      .then(response => {
        if(response.documents.length == 0){
          console.log(`문서정보 조회 실패.`);
        }        
        documentInfo = response.documents;
        setDocumentInfo(documentInfo);
        setIssued(issued);
        switch(val){
          case 7: setOpenEdit7(true); break;//졸업장
          case 6: setOpenEdit6(true); break;//개근상장
          case 8: setOpenEdit8(true); break;//정근상장
          case 5: setOpenEdit5(true); break;//입학통지서
          case 4: setOpenEdit4(true); break;//재학증명서
          case 9: setOpenEdit9(true); break;//상장
        }       
        setEditable(editable);   
      })
      .catch(err => console.log(err));
      return documentInfo;
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
      > 
  
      {/** 상장 모달팝업 */}        
      <PrizeModal
        onClose={prizeClose}
        open={openEdit9}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />

      {/** 졸업장 모달팝업 */}        
      <GraduateDocModal
        onClose={graduateDocClose}
        open={openEdit7}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />

      {/** 정근상장 모달팝업 */}        
      <RegularModal
        onClose={regularClose}
        open={openEdit8}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />

      {/** 개근상장, 모달팝업 */}        
      <AttendanceModal
        onClose={attendanceClose}
        open={openEdit6}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />
      
      {/** 입학통시서 모달팝업 */}        
      <EntranceModal
        onClose={entranceClose}
        open={openEdit5}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />
    
      {/** 재학증명서 모달팝업 */}        
      <EnrollmentModal
        onClose={enrollmentClose}
        open={openEdit4}
        editable={editable}
        issued={issued}
        documentInfo={documentInfo}
        search={search}
      />

      {/**휴학 모달팝업 */}                   
      <LeaveAbsenseModal
        onClose={leaveAbsenseClose}
        open={openEdit}
        editable={editable}
        search={search}
      /> 

      {/**복학 모달팝업 */}                   
      <ReturnModal
        onClose={returnClose}
        open={openEdit2}
        editable={editable}
        search={search}
      />  

      {/**졸업 모달팝업 */}                   
      <GraduateModal
        onClose={graduateClose}
        open={openEdit3}
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
          title="전체 학생"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table  style={{width:1800}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:120}}>학생</TableCell>
                    <TableCell align="center" style={{width:110}} >입학일</TableCell>
                    <TableCell align="center">최종학년</TableCell>
                    <TableCell align="center" style={{width:60}}>상태</TableCell>
                    <TableCell align="right" >금년잔액</TableCell>
                    <TableCell align="center" >휴학</TableCell>
                    <TableCell align="center" >복학</TableCell>
                    <TableCell align="center" >졸업</TableCell>
                    <TableCell align="center" >입학통지서</TableCell>
                    <TableCell align="center" >개근상장</TableCell>
                    <TableCell align="center" >정근상장</TableCell>
                    <TableCell align="center" >재학증명서</TableCell>
                    <TableCell align="center" >졸업장</TableCell>
                    <TableCell align="center" >상장</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : results
                   ).map((result) => (
                    <TableRow
                      hover
                      key={result.studentId}
                    >
                      <TableCell align="center" className={classes.tableStudent}>{result.koreanName}<br/>({result.studentNo})</TableCell>
                      <TableCell align="center" >{DataExtract.getFommatedDate(result.entranceDay, '-')}</TableCell>
                      <TableCell align="center" className={classes.tableStudent}>{result.departmentName}<br/>{result.gradeName} {result.className}</TableCell>
                      <TableCell align="center" className={classes.tableClass}>{result.studentStatusName}</TableCell>
                      <TableCell align="right" className={classes.tableClass}>{result.balance === "0.00" ? "" : result.balance}</TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'STD' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => leaveAbsenseOpen(result)}
                        > 휴학
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'LEV' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => returnOpen(result)}
                        > 복학
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'STD' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => graduateOpen(result)}
                        > 졸업
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'STD' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => entranceOpen(result)}
                        > 입학통지서
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'STD' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => attendanceOpen(result)}
                        > 개근상장
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">
                        {result.studentStatus === 'STD' ?                        
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => regualarOpen(result)}
                        > 정근상장
                        </Button>
                        : ''} 
                      </TableCell>
                      <TableCell align="center">                    
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => enrollmentOpen(result)}
                        > 재학증명서
                        </Button>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => graduateDocOpen(result)}
                        > 졸업장
                        </Button>
                      </TableCell>    
                      
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => prizeOpen(result)}
                        > 상장
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
