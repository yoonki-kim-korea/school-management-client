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
import ClassroomUpdateModal from './ClassroomUpdateModal';
import Proxy       from '../../../utils/Proxy';
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

function Results({ className, classrooms, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, classrooms.length - page * rowsPerPage);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableCode, setEditableCode]= useState(false);
  
  const handleEditOpen = (classroom) => {
    setOpenEdit(true);    
    setEditableCode(classroom);
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
   * 교실 삭제
   * @param {*} classroom 
   */
  const deleteClassroom = (classroom) => {
    if(!window.confirm(`${classroom.classroomName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/classroom/delete ';
    const formData = new FormData();
    formData.append('classroomId', classroom.classroomId);  
    formData.append('udtId', 'root');  
   
    const config = {
        headers : {
            'content-type' : 'multipart/form-data'
        },
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

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**교실 수정 모달팝업 */}                   
        <ClassroomUpdateModal
          onClose={updateModalClose}
          open={openEdit}
          currentClassroom={editableCode}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {classrooms.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(classrooms.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 교실"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">교실명</TableCell>
                    <TableCell align="center">위치상세정보</TableCell>
                    <TableCell align="center">정원</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? classrooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : classrooms
                   ).map((classroom) => (
                    <TableRow
                      hover
                      key={classroom.classroomId}
                    >
                      <TableCell align="center">{classroom.classroomName}</TableCell>
                      <TableCell align="center">{classroom.positionDesc}</TableCell>
                      <TableCell align="center">{classroom.capacity}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(classroom)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteClassroom(classroom)}
                        > 삭제
                        </Button>      
                        </TableCell>
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
                    count={classrooms.length}
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
  classrooms: PropTypes.array
};

Results.defaultProps = {
  classrooms: []
};

export default Results;
