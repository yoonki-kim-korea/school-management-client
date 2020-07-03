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
import UpdateModal from './UpdateModal';
import Proxy       from '../../../../../utils/Proxy';
import DataExtract       from '../../../../../utils/DataExtract';
import TablePaginationActions from '../../../../../utils/TablePaginationActions';

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
 * 교사별 계약 목록
 * @param {*} param0 
 */
function Results({ className, contacts, search, teacherId, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editable, setEditable]= useState(false);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, contacts.length - page * rowsPerPage);
  
  const handleEditOpen = (contact) => {
    setOpenEdit(true);    
    setEditable(contact);
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
   * @param {*} contact 
   */
  const deleteContact = (contact) => {
    if(!window.confirm(`삭제하시겠습니까?`)){
      return;
    }
    
    const url = '/api/teacher/contact/delete';
    const formData = new FormData();
    formData.append('contactId', contact.contactId);  
    formData.append('teacherId', teacherId);  
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
  }//deleteContact

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >  
        {/**메노 수정 모달팝업 */}                   
        <UpdateModal
          onClose={updateModalClose}
          open={openEdit}
          editable={editable}
          search={search}
          teacherId={teacherId}
        /> 
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체
        {' '}
        {contacts.length}
        {' '}
        개. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(contacts.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="계약 목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table style={{width:750}}>
                <TableHead>
                  <TableRow>
                    <TableCell align="right" style={{width:100}}>순번</TableCell>
                    <TableCell align="center" style={{width:150}}>계약시작일</TableCell>
                    <TableCell align="center" style={{width:150}}>계약종료일</TableCell>
                    <TableCell align="center" style={{width:150}}>실제종료일</TableCell>
                    <TableCell align="center" style={{width:100}}>수정</TableCell>
                    <TableCell align="center" style={{width:100}}>삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : contacts
                   ).map((contact, index) => (
                    <TableRow
                      hover
                      key={contact.contactId}
                    >
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="center">{DataExtract.getFommatedDate(contact.contactStartDate, '-')}</TableCell> 
                      <TableCell align="center">{DataExtract.getFommatedDate(contact.contactEndDate, '-')}</TableCell> 
                      <TableCell align="center">{DataExtract.getFommatedDate(contact.realEndDate, '-')}</TableCell> 
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleEditOpen(contact)}
                        > 수정
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => deleteContact(contact)}
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
                    count={contacts.length}
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
  contacts: PropTypes.array
};

Results.defaultProps = {
  contacts: []
};

export default Results;
