import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import SuperCodeUpdateModal from './SuperCodeUpdateModal';
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

function Results({ className, superCodes, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableSuperCode, setEditableSuperCode]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, superCodes.length - page * rowsPerPage);
  
  const handleEditOpen = (superCode) => {
    setOpenEdit(true);    
    setEditableSuperCode(superCode);
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

  const deleteSuperCode = (superCode) => {
    if(!window.confirm(`${superCode.superCodeName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/codem/super/delete';
    const formData = new FormData();
    formData.append('superCodeId', superCode.superCodeId);  
    formData.append('udpId', 'root');  
   
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
          alert('삭제실패');
        }
    });
  }//deleteSuperCode

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >        
        {/**슈퍼공통코드 수정 모달 팝업 */}                  
        <SuperCodeUpdateModal
          onSaveAndClose={updateModalSaveAndClose}
          onClose={updateModalClose}
          open={openEdit}
          editableSuperCode={editableSuperCode}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {superCodes.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(superCodes.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 슈퍼코드"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>슈퍼코드</TableCell>
                    <TableCell>슈퍼코드명</TableCell>
                    <TableCell>정렬순서</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                    <TableCell align="center">해당 공통코드 보기</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? superCodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : superCodes
                   ).map((superCode) => (
                    <TableRow
                      hover
                      key={superCode.superCodeId}
                    >
                      <TableCell>{superCode.superCode}</TableCell>
                      <TableCell>{superCode.superCodeName}</TableCell>
                      <TableCell>{superCode.wellOrder}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(superCode)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteSuperCode(superCode)}
                        > 삭제
                        </Button>      
                        </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={"/code/list/" + superCode.superCodeId}
                          variant="outlined"
                        > 상세보기
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
                    count={superCodes.length}
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
  superCodes: PropTypes.array
};

Results.defaultProps = {
  superCodes: []
};

export default Results;
