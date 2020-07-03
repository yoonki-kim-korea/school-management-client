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
  TableFooter,
  TablePagination,
  TableRow,
  Link,
  Typography
} from '@material-ui/core';
import DataExtract from '../../../utils/DataExtract';
import TablePaginationActions from '../../../utils/TablePaginationActions';
import EmploymentModal from './modals/EmploymentModal';
import EmploymentKrModal from './modals/EmploymentKrModal';

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

function Results({ className, teachers, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, teachers.length - page * rowsPerPage);
  const handleChangePage = (event, page) => {
    setPage(page);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }

  const [openEdit0, setOpenEdit0] = useState(false); //재직증명서-독일
  const [openEdit1, setOpenEdit1] = useState(false);//재직증명서-한글
  const [editable, setEditable]= useState(false);
  const [issued, setIssued] = useState(false);
  const [contacts, setContacts] = useState(false);//재직증명서의 계약목록
  const [documentInfo, setDocumentInfo] = useState(false);


  
  /**
   * 사용자 목록 조회
   */
  const searchContacts = (documentInfo, editable) => {
    let query  = '/api/teacher/contact/list?';
        query += 'teacherId=' + editable.teacherId ;
    callApi(query)
    .then(response => {
      if(response.results.length == 0){
        setContacts({});      
      }else{
        setContacts(response.results);      
      }   
      getDocumentInfo(`/api/document/info?documentId=EMPLOYMENT`, documentInfo, editable, 0);
    })
    .catch(err => console.log(err));
  }; //search


  /**
   * 독어 재직증명서
   * @param {*} editable 
   */
  const employmentOpen = (editable) => {
    let query = '/api/issued/new?documentType=M&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      searchContacts(response.results[0], editable)
    })  
    .catch((err) => {
        console.log(err);
    });
  }

  const employmentClose = () => {
    setOpenEdit0(false); 
  }

  /**
   * 한글 재직증명서
   * @param {*} editable 
   */
  const employmentKrOpen = (editable) => {
    let query = '/api/issued/new?documentType=K&issuedDate=' + DataExtract.todayDate("");
    callApi(query)
    .then(response => {
      getDocumentInfo(`/api/document/info?documentId=EMPLOYMENTKR`, response.results[0], editable, 1);
    })  
    .catch((err) => {
        console.log(err);
    });
  }

  const employmentKrClose = () => {
    setOpenEdit1(false); 
  }

  /**
   * 문서 정보 조회
   */
  const getDocumentInfo = async (query, issued, editable, val) => {      
    let documentInfo;
      await callApi(query)
      .then(response => {
        if(response.documents.length === 0){
          alert(`문서정보 조회 실패. documentId=EMPLOYMENT`);
        }        
        documentInfo = response.documents;
        setDocumentInfo(documentInfo);
        setIssued(issued);     
        setEditable(editable);   
        switch(val){
          case 0: setOpenEdit0(true); break; //독어 재직증명서
          case 1: setOpenEdit1(true); break; //한글 재직증명서
        }       
      })
      .catch(err => console.log(err));
      return documentInfo;
  }


  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >

      
    {/** 재직증명서-독어 모달팝업 */}        
    <EmploymentModal
      onClose={employmentClose}
      open={openEdit0}
      editable={editable}
      issued={issued}
      documentInfo={documentInfo}
      contacts={contacts}
      search={search}
    />

    {/** 재직증명서한글 모달팝업 */}        
    <EmploymentKrModal
      onClose={employmentKrClose}
      open={openEdit1}
      editable={editable}
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
        {teachers.length}
        {' '}
        명. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(teachers.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 교직원"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:120}}>교직원 번호</TableCell>
                    <TableCell align="left" style={{width:120}}>성명</TableCell>
                    <TableCell align="left" style={{width:180}}>영문명</TableCell>
                    <TableCell align="left" style={{width:100}}>직무</TableCell>
                    <TableCell align="left" style={{width:170}}>담임반</TableCell>
                    <TableCell align="center" style={{width:100}}>재직여부</TableCell>
                    <TableCell align="center" style={{width:120}}>생년월일</TableCell>
                    <TableCell align="left" style={{width:200}}>전화번호</TableCell>
                    <TableCell align="left" style={{width:100}}>이메일</TableCell>
                    <TableCell align="center" style={{width:120}}>임용일자</TableCell>
                    <TableCell align="center" style={{width:120}}>퇴직일자</TableCell>
                    <TableCell align="center" style={{width:200}} colSpan="2">재직증명서</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? teachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : teachers
                   ).map((teacher) => (
                    <TableRow
                      hover
                      key={teacher.teacherId}
                     >
                      <TableCell align="center">
                        <Link
                            className={classes.link}
                            color="primary"
                            href={"/teacher/view/" + teacher.teacherId + "/basicInfo"}
                            target="_self"
                          >
                            <u>{DataExtract.getFommatedTeacherNo(teacher.teacherNo,'-')}</u>
                          </Link>             
                        
                      </TableCell>
                      <TableCell align="left">{teacher.teacherName}</TableCell>
                      <TableCell align="left">{teacher.teacherEngName}</TableCell>
                      <TableCell align="left">{teacher.dutyName}</TableCell>
                      <TableCell>{teacher.myClass2}</TableCell>
                      <TableCell align="center">{teacher.workStatusStr}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(teacher.birthday,'-')}</TableCell>
                      <TableCell align="left">{teacher.mobileNo}</TableCell>
                      <TableCell align="left">{teacher.email}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(teacher.joinDay,'-')}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(teacher.resignDay,'-')}</TableCell>
                      
                      <TableCell align="center" style={{width:90}}>                  
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => employmentOpen(teacher)}
                        > 독어
                        </Button>
                      </TableCell>
                      <TableCell align="center" style={{width:90}}>                  
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => employmentKrOpen(teacher)}
                        > 한글
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={11} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={teachers.length}
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
  teachers: PropTypes.array
};

Results.defaultProps = {
  teachers: []
};

export default Results;
