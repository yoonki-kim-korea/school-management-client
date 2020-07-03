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
import TableEditBar from 'src/components/TableEditBar';
import ClassinfoUpdateModal from './modals/ClassinfoUpdateModal';
import ClassinfoCancelModal from './modals/ClassinfoCancelModal';
import Proxy       from '../../../utils/Proxy';
import AssignStudentsModal from './modals/AssignStudentsModal';
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
 * 신규학급 생성 및 관리
 * @param {*} param0 
 */
function Results({ className, classinfos, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, classinfos.length - page * rowsPerPage);
  const handleChangePage = (event, page) => {
    setPage(page);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssignStudents, setOpenAssignStudents] = useState(false);
  const [editableCode, setEditableCode] = useState(false);
  const [assignList, setAssignList] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  
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
   * 이미 배정된 학생목록 조회
   * @param {*} classinfo 
   */
  const assignStudents = (classinfo) => {
    let query = `/api/classinfo/assign/list?classId=${classinfo.classId}`;  
    callApi(query)
    .then(response => {
      if(response.assigns.length == 0){
        setAssignList([]);
      }else{
        setAssignList(response.assigns);
      }
      setOpenAssignStudents(true);
      setEditableCode(classinfo);
    })
    .catch(err => console.log(err));
  }

  /**
   * 학생배정 팝업 닫기
   */
  const closeAssignStudents = () => {
    setOpenAssignStudents(false);
  }
  
  const handleEditOpen = (classinfo) => {
    setOpenEdit(true);    
    setEditableCode(classinfo);
  }  

  /**
   * 학급정보 수정 팝업 닫기
   */
  const updateModalClose = () => {
    setOpenEdit(false); 
  }

  /**
   * 폐강
   * @param {*} classinfo 
   */
  const cancelClassinfo = (classinfo) => {
    if(classinfo.classStatus !== 'ASSIGN'){
      alert('폐강은 배정 상태인 학급만 가능합니다.');
      return;
    }
    setOpenCancelModal(true);    
    setEditableCode(classinfo);
  }

  /**
   * 반확정-운영시작
   * @param {*} classinfo 
   */
  const determineClassinfo = (classinfo) => {
    if(classinfo.classStatus !== 'ASSIGN'){
      alert('반확정은 배정 상태인 학급만 가능합니다.');
      return;
    }
    
    if(!window.confirm(`${classinfo.departmentName} ${classinfo.gradeName} ${classinfo.classNoName}를 확정하고 운영을 시작하시겠습니까? 이후에는 운영 학급 관리 화면에서 관리됩니다.`)){
      return;
    }
    
    const url = '/api/classinfo/determine';
    const formData = new FormData();  
    formData.append('classId', classinfo.classId);  
    formData.append('classType', classinfo.classType);  
    formData.append('startDate', classinfo.startDate);  
    formData.append('udtId', "root");  
  
    const config = {
        headers : {
            'content-type' : 'multipart/form-data'
        },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert('반확정 성공');
          search();
        }else{
          alert('반확정 실패');
        }
    });
  }

  /**
   * 폐강 팝업 닫기
   */
  const closeCancelModal = () => {
    setOpenCancelModal(false);
  }

  /**
   * 학급 삭제
   * @param {*} classinfo 
   */
  const deleteClassinfo = (classinfo) => {
    if(!window.confirm(`${classinfo.className}를 삭제하시겠습니까?`)){
      return;
    }

    if(classinfo.classStatus != 'NOASSIGN'){
      alert('학생미배정 상태인 학급만 삭제할 수 있습니다.');
      return;
    }
    
    const url = '/api/classinfo/delete ';
    const formData = new FormData();
    formData.append('classId', classinfo.classId);  
    formData.append('udtId', 'root');  
   
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
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
  }//deleteClassinfo

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**학급 폐강 모달팝업 */}                   
        <ClassinfoCancelModal
          onClose={closeCancelModal}
          open={openCancelModal}
          currentClassinfo={editableCode}
          search={search}
        /> 

        {/**학급 수정 모달팝업 */}                   
        <ClassinfoUpdateModal
          onClose={updateModalClose}
          open={openEdit}
          currentClassinfo={editableCode}
          search={search}
        /> 

        {/**학급 배정 모달팝업 */}                   
        <AssignStudentsModal
          onClose={closeAssignStudents}
          open={openAssignStudents}
          classinfo={editableCode}
          assignList={assignList}
          searchList={search}
        /> 

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
          title="전체 신규 학급"
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
                    <TableCell align="center">배정</TableCell>
                    <TableCell align="center">상태</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                    <TableCell align="center">폐강</TableCell>
                    <TableCell align="center">학생 배정</TableCell>
                    <TableCell align="center">반확정</TableCell>
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
                      <TableCell align="center">{classinfo.classStatusName}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(classinfo)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteClassinfo(classinfo)}
                        > 삭제
                        </Button>      
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => cancelClassinfo(classinfo)}
                        > 폐강
                        </Button>      
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => assignStudents(classinfo)}
                        > 학생 배정
                        </Button>      
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => determineClassinfo(classinfo)}
                        > 반확정
                        </Button>      
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={16} />
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

Results.propTypes = {
  className: PropTypes.string,
  classinfos: PropTypes.array
};

Results.defaultProps = {
  classinfos: []
};

export default Results;
