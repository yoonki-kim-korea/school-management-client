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
  TableFooter,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import TablePaginationActions from '../../../../../utils/TablePaginationActions';
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
 * 운영학급관리 > 학생 재배정 및 관리 > 학급 이동 모달의 이동할 학급목록 결과
 * @param {*} param0 
 */
function TrandeStudentResult({ search, onClose, className, classinfos, student, ...rest }) {
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
  
  const [selectedClassinfos, setSelectedClassinfos] = useState(classinfos);
  /**
   * 이동할 학급 선택
   * @param {*} classinfo 
   */
  const tradeStudent = (classinfo) => {
    const url = '/api/operclass/student/trade/update';
    const formData = new FormData();  
    const oldClassId = student.classId;

    if(oldClassId === classinfo.classId){
      alert('선택한 학급은 현재 학급입니다.');
      return;
    }
    if(student.semesterId != classinfo.semesterId){
      alert('학기가 다릅니다.');
      return;
    }
    if(student.schoolfeeType != classinfo.schoolfeeType){
      alert('수업유형이 다릅니다. 정규->정규 또는 특별->특별로만 이동이 가능합니다.');
      return;
    }

    let startDate = DataExtract.getDateString(document.getElementById('startDateOfCurrent').value);
    let endDate = DataExtract.getDateString(document.getElementById('endDateOfNext').value);    

    if(endDate === ""){
      alert("현재학급 수강중단일을 입력하지 않았습니다.");
      return;
    }
    if(startDate === ""){
      alert("옮길 학급 수강시작일을 입력하지 않았습니다.");
      return;
    }
    if(startDate > classinfo.endDate){
      alert("선택한 옮길 학급의 시작일이 학급종료일 이후입니다.");
      return;
    }
    if(endDate < classinfo.startDate){
      alert("선택한 현재학급의 수강종료일이 학급시작일 이전입니다.");
      return;
    }
    if(endDate > classinfo.endDate){
      alert("선택한 현재학급의 수강종료일이 학급종료일 이후입니다.");
      return;
    }

    formData.append('studentId', student.studentId);  
    formData.append('oldClassId', oldClassId);  
    formData.append('newClassId', classinfo.classId);  
    formData.append('classType', classinfo.classType);  
    formData.append('startDate', startDate);  
    formData.append('endDate', endDate);  
    formData.append('udtId', "root");  
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
  
    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert('저장 성공');
          search();
          onClose();
        }else{
          alert('저장 실패');
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
          action={<GenericMoreButton />}
          title="이동 대상 학급 목록"
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
                    <TableCell align="center">유형</TableCell>
                    <TableCell align="center">시간구분</TableCell>
                    <TableCell align="center">교실</TableCell>
                    <TableCell align="center">담임</TableCell>
                    <TableCell align="center">정원</TableCell>
                    <TableCell align="center">재적</TableCell>
                    <TableCell align="center">선택</TableCell>
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
                      selected={selectedClassinfos.indexOf(classinfo.classinfoId) !== -1}
                    >
                      <TableCell align="center">{classinfo.semesterName}</TableCell>
                      <TableCell align="center">{classinfo.departmentName}</TableCell>
                      <TableCell align="center">{classinfo.gradeName}</TableCell>
                      <TableCell align="center">{classinfo.classNoName}</TableCell>
                      <TableCell align="center">{classinfo.classTypeName}</TableCell>
                      <TableCell align="center">{classinfo.classTimeName}</TableCell>
                      <TableCell align="center">{classinfo.classroomName}</TableCell>
                      <TableCell align="center">{classinfo.teacherName}</TableCell>
                      <TableCell align="center">{classinfo.classCapacity}</TableCell>
                      <TableCell align="center">{classinfo.classAssign}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => tradeStudent(classinfo)}
                        > 선택
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

TrandeStudentResult.propTypes = {
  className: PropTypes.string,
  classinfos: PropTypes.array
};

TrandeStudentResult.defaultProps = {
  classinfos: []
};

export default TrandeStudentResult;
