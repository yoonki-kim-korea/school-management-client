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
import CodeUpdateModal from './CodeUpdateModal';
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

function Results({ className, codes, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editableCode, setEditableCode]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, codes.length - page * rowsPerPage);
  
  const handleEditOpen = (code) => {
    setOpenEdit(true);    
    setEditableCode(code);
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
   * 공통코드 삭제
   * @param {*} code 
   */
  const deleteCode = (code) => {
    if(!window.confirm(`${code.codeName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/codem/code/delete';
    const formData = new FormData();
    formData.append('codeId', code.codeId);  
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
          alert('삭제 실패');
        }
    });
  }//deleteSuperCode

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**공통코드 수정 모달팝업 */}                   
        <CodeUpdateModal
          onSaveAndClose={updateModalSaveAndClose}
          onClose={updateModalClose}
          open={openEdit}
          editableCode={editableCode}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {codes.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(codes.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 코드"
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
                    <TableCell>코드</TableCell>
                    <TableCell>코드명</TableCell>
                    <TableCell>정렬순서</TableCell>
                    <TableCell align="center">수정</TableCell>
                    <TableCell align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? codes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : codes
                   ).map((code) => (
                    <TableRow
                      hover
                      key={code.codeId}
                    >
                      <TableCell>{code.superCode}</TableCell>
                      <TableCell>{code.superCodeName}</TableCell>
                      <TableCell>{code.code}</TableCell>
                      <TableCell>{code.codeName}</TableCell>
                      <TableCell>{code.wellOrder}</TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(code)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteCode(code)}
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
                    count={codes.length}
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
  codes: PropTypes.array
};

Results.defaultProps = {
  codes: []
};

export default Results;
