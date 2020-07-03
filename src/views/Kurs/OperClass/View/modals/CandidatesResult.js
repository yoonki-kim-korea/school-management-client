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
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableFooter,
  Typography,
  TextField
} from '@material-ui/core';
import TablePaginationActions from '../../../../../utils/TablePaginationActions';
import GenericMoreButton from 'src/components/GenericMoreButton';
import DataExtract from '../../../../../utils/DataExtract';

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
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

/**
 * 운영학급관리 > 학생 재배정 및 관리 > 학생전입 모달 > 전입대상 학생목록 결과
 * @param {*} param0 
 */
function CandidatesResult({ search, onClose, className, classId, classType, students,  ...rest }) {
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
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);
  
  
  /**
   * 전입
   * @param {*} student 
   */
  const insertStudent = (student) => {

    let startDate = document.getElementById('startDate_' + student.studentId).value;
    if(startDate == ""){
      alert('수강시작일을 입력하지 않았습니다.');
      return;
    }
    startDate = DataExtract.getDateString(startDate);
    
    if(startDate < document.getElementById('checkStartDate').value){
      alert('수강시작일이 학기 시작일 이전입니다.');
      return;
    }
    if(startDate > document.getElementById('checkEndDate').value){
      alert('수강시작일이 학기 종료일 이후입니다.');
      return;
    }
    
    const url = '/api/operclass/student/register/update';
    const formData = new FormData();  
    formData.append('studentId', student.studentId);  
    formData.append('classType', classType);  
    formData.append('classId', classId);  
    formData.append('creId', "root");  
    formData.append('startDate', startDate);  
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
  
    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert('전입 성공');
          search();
          onClose();
        }else{
          alert('전입 실패');
        }
    });  
  }//insertStudent

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
          action={<GenericMoreButton />}
          title="전입대상 학생목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>학번</TableCell>
                    <TableCell>한글성명</TableCell>
                    <TableCell>독어성명</TableCell>
                    <TableCell>생년월일</TableCell>
                    <TableCell>입학일</TableCell>
                    <TableCell>부모</TableCell>
                    <TableCell>수강시작일</TableCell>
                    <TableCell align="right">선택</TableCell>
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
                      <TableCell>{DataExtract.getFommatedStudentNo(student.studentNo,'-')}</TableCell>
                      <TableCell>{student.koreanName}</TableCell>
                      <TableCell>{student.germanName}</TableCell>
                      <TableCell>{DataExtract.getFommatedDate(student.birthday,'-')}</TableCell>
                      <TableCell>{DataExtract.getFommatedDate(student.entranceDay,'-')}</TableCell>
                      <TableCell>{student.fatherName}, {student.motherName}</TableCell>
                      <TableCell>
                        <TextField
                          id={'startDate_' + student.studentId}
                          name="startDate"
                          label="수강시작일"
                          type="date"
                          defaultValue=""
                          className={classes.dateField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          size="small"
                          onClick={()=>{insertStudent(student)}}
                          variant="outlined"
                        >
                          선택
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

CandidatesResult.propTypes = {
  className: PropTypes.string,
  classinfos: PropTypes.array
};

CandidatesResult.defaultProps = {
  classinfos: []
};

export default CandidatesResult;
