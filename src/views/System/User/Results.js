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
import UserUpdateModal from './UserUpdateModal';
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

function Results({ className, users, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableUser, setEditableCode]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  
  const handleEditOpen = (user) => {
    setOpenEdit(true);    
    setEditableCode(user);
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
   * 사용자 삭제
   * @param {*} user 
   */
  const deleteCode = (user) => {
    if(!window.confirm(`${user.userName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/user/delete';
    const formData = new FormData();
    formData.append('userId', user.userId);  
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
  }//deleteSuperCode

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**사용자 수정 모달팝업 */}                   
        <UserUpdateModal
          onSaveAndClose={updateModalSaveAndClose}
          onClose={updateModalClose}
          open={openEdit}
          editableUser={editableUser}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {users.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(users.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 사용자"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>사용자ID</TableCell>
                    <TableCell>사용자명</TableCell>
                    <TableCell>권한</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : users
                   ).map((user) => (
                    <TableRow
                      hover
                      key={user.userId}
                    >
                      <TableCell>{user.userId}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.auth}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(user)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteCode(user)}
                        > 삭제
                        </Button>      
                        </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={users.length}
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
  users: PropTypes.array
};

Results.defaultProps = {
  users: []
};

export default Results;
