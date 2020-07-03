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
import DiaryUpdateModal from './DiaryUpdateModal';
import Proxy       from '../../../../utils/Proxy';
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
 * 학생별 메모
 * @param {*} param0 
 */
function Results({ className, diarys, search, studentId, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableDiary, setEditableDiary]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, diarys.length - page * rowsPerPage);
  
  const handleEditOpen = (user) => {
    setOpenEdit(true);    
    setEditableDiary(user);
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
   * 메모 삭제
   * @param {*} diary 
   */
  const deleteMemo = (diary) => {
    if(!window.confirm(`삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/diary/delete';
    const formData = new FormData();
    formData.append('diaryId', diary.diaryId);  
    formData.append('studentId', studentId);  
    formData.append('udtId', 'root');  
   
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
  }//deleteMemo

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**메노 수정 모달팝업 */}                   
        <DiaryUpdateModal
          onClose={updateModalClose}
          open={openEdit}
          editableDiary={editableDiary}
          search={search}
          studentId={studentId}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {diarys.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(diarys.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="메모 목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table  style={{width:1500}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" style={{width:100}}>작성자</TableCell>
                    <TableCell align="center" style={{width:200}}>작성일시</TableCell>
                    <TableCell align="left" style={{width:600}}>내용</TableCell>
                    <TableCell align="center" style={{width:100}}>수정</TableCell>
                    <TableCell align="center" style={{width:100}}>삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? diarys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : diarys
                   ).map((diary) => (
                    <TableRow
                      hover
                      key={diary.diaryId}
                    >
                      <TableCell align="left">{diary.creName}</TableCell>
                      <TableCell align="center">{diary.creDtm}</TableCell>
                      <TableCell align="left">{(diary.content != "" && diary.content.length <= 30) ? diary.content : diary.content.substring(0, 30) + '...'}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(diary)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteMemo(diary)}
                        > 삭제
                        </Button>      
                        </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={diarys.length}
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
  diarys: PropTypes.array
};

Results.defaultProps = {
  diarys: []
};

export default Results;
