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
import UpdateModal from './UpdateModal';
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
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

function Results({ className, documents, search, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editable, setEditableSuperCode]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, documents.length - page * rowsPerPage);
  
  const handleEditOpen = (document) => {
    setOpenEdit(true);    
    setEditableSuperCode(document);
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

  const deleteSuperCode = (document) => {
    if(!window.confirm(`${document.itemName}를 삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/document/delete';
    const formData = new FormData();
    formData.append('documentId', document.documentId);  
    formData.append('itemId', document.itemId);  
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
        <UpdateModal
          onClose={updateModalClose}
          open={openEdit}
          editable={editable}
          search={search}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {documents.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(documents.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="전체 항목"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table style={{width:1500}}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{width:400}}>항목ID</TableCell>
                    <TableCell style={{width:400}}>항목명</TableCell>
                    <TableCell style={{width:400}}>항목값</TableCell>
                    <TableCell style={{width:150}} align="center">수정</TableCell>
                    <TableCell  style={{width:150}}align="center">삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : documents
                   ).map((document) => (
                    <TableRow
                      hover
                      key={document.itemId}
                    >
                       <TableCell>{document.itemId}</TableCell>
                       <TableCell>{document.itemName}</TableCell>
                       <TableCell>{document.itemValue}</TableCell>
                       <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(document)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteSuperCode(document)}
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
                    count={documents.length}
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
  documents: PropTypes.array
};

Results.defaultProps = {
  documents: []
};

export default Results;
