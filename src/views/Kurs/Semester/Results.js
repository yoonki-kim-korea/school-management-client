import React, { useState } from 'react';
import {post} from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
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
import SemesterUpdateModal from './SemesterUpdateModal';
import Proxy       from '../../../utils/Proxy';
import DataExtract       from '../../../utils/DataExtract';
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
 * 학기관리
 * @param {*} param0 
 */
function Results({ className, semesters, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableCode, setEditableCode]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, semesters.length - page * rowsPerPage);
    
  const handleEditOpen = (semester) => {
    setOpenEdit(true);    
    setEditableCode(semester);
  }

  const updateModalClose = () => {
    setOpenEdit(false); 
  }

  const updateModalSaveAndClose = () => {
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
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/semester/delete/valid?' + query);
    const body = await response.json();
    return body;
  }  

  /**
   * 학기 삭제
   * @param {*} semester 
   */
  const deleteSemester = (semester) => {
    if(!window.confirm(`${semester.semesterName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/semester/delete ';
    const formData = new FormData();
    formData.append('semesterId', semester.semesterId);  
    formData.append('udtId', 'root');  
   
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
      
     //삭제 가능여부 검사
    callApi('semesterId=' + semester.semesterId )
    .then(response => {
    if(!!response.valid && response.valid === "Y"){
      /////////////////////////      
      post(url, formData, config, Response)
          .then(response => {
            if(response.data.result === "success"){            
              alert('삭제 성공');
              search();
            }else{
              alert('삭제 실패');
            }
        });
          /////////////////////////
        }else{
          alert(`해당 학기에 등록된 학급이 있으므로 삭제할 수 없습니다.`);
        }
      })
      .catch(err => {
        alert(`삭제를 실패하였습니다.`);
        console.log(err);
      });
    //등록가능여부 검사      
  }//deleteSemester

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**학기 수정 모달팝업 */}                   
        <SemesterUpdateModal
          onSaveAndClose={updateModalSaveAndClose}
          onClose={updateModalClose}
          open={openEdit}
          currentSemester={editableCode}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {semesters.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(semesters.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 학기"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">학기</TableCell>
                    <TableCell align="center">시작일자</TableCell>
                    <TableCell align="center">종료일자</TableCell>
                    <TableCell align="center">수업일수</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? semesters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : semesters
                   ).map((semester) => (
                    <TableRow
                      hover
                      key={semester.semesterId}
                    >
                      <TableCell align="center">{semester.semesterName}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(semester.startDate, '-')}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(semester.endDate, '-')}</TableCell>
                      <TableCell align="center">{semester.schoolDaysCount}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(semester)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteSemester(semester)}
                        > 삭제
                        </Button>      
                        </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={semesters.length}
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
  semesters: PropTypes.array
};

Results.defaultProps = {
  semesters: []
};

export default Results;
