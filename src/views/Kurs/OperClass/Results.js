import React, { useState } from 'react';
import {post} from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles, makeStyles } from '@material-ui/styles';
import Tooltip from "@material-ui/core/Tooltip";
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
import ClassinfoUpdateModal from './modals/ClassinfoUpdateModal';
import Proxy       from '../../../utils/Proxy';
import ExcelInfo     from '../../../utils/ExcelInfo';
import DataExtract     from '../../../utils/DataExtract';
import TablePaginationActions from '../../../utils/TablePaginationActions';

/**
 * 툴팁에 적용되는 스타일
 */
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

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
 * 운영학급관리
 * @param {*} param0 
 */
function Results({ className, classinfos, search, ...rest }) {
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
  const [openEdit, setOpenEdit] = useState(false);
  const [editableCode, setEditableCode] = useState(false);
  
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
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
   * 종강
   * @param {*} classinfo 
   */
  const endClassinfo = (classinfo) => {
    if(window.confirm(`${classinfo.semesterName} ${classinfo.departmentName} ${classinfo.className} 을 종강하기겠습니까? 완강한 학생들의 수강종료일은 ${DataExtract.getFommatedDate(classinfo.endDate,'-')}으로 수료됩니다.`)){
      const url = '/api/classinfo/end';
      const formData = new FormData();

      formData.append('classId', classinfo.classId);  
      formData.append('endDate', classinfo.endDate);//수강종료일  
      formData.append('udtId', "root");  

      const config = {
          headers : { 'content-type' : 'multipart/form-data' },
          proxy: Proxy.ProxyConfig
      }
    
      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert('종강되었습니다.');
            search();
          }else{
            alert('종강 실패');
          }
      });
    }//if
  }//endClassinfo

  /**
   * 엑셀변환할 때 사용할 주소목록 조회
   * @param {*} classinfo 
   */
  const getAddresses = async (classinfo) => {
    let rtnAddress;
    let query = `/api/operclass/address/list?classId=${classinfo.classId}`; 
      await callApi(query)
      .then(response => {
        if(response.address.length == 0){
          console.log(`주소록을 인쇄할 학생목록이 없음. classId=${classinfo.classId}`);
        }        
        rtnAddress = response.address;
      })
      .catch(err => console.log(err));
      return rtnAddress
  }//getAddresses

  /**
   * 반별 주소록 엑셀변환
   * @param {*} classinfo 
   */
  const printAddresses = async (classinfo) => {     
    classinfo.address = await getAddresses(classinfo);
    makeAddress(classinfo);
  }//getAddresses

  /**
   * 주소록 엑셀 변환
   * @param {*} classinfo 
   */
  const makeAddress = async (classinfo) => {
    const url = '/api/print/excel/address';
    const formData = new FormData();    
          formData.append('classinfo', JSON.stringify(classinfo));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert(`${ExcelInfo.AaddressDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });
  }

  /**
   * 반별 출석부 엑셀변환
   * @param {*} classinfo 
   */
  const printClassbook = async (classinfo) => { 
    classinfo.address = await getAddresses(classinfo);
    makeClassbook(classinfo);
  }//printClassbook

  /**
   * 출석부 엑셀변환
   * @param {*} classinfo 
   */
  const makeClassbook = async (classinfo) => {
    const url = '/api/print/excel/classbook';
    const formData = new FormData();    
    formData.append('classinfo', JSON.stringify(classinfo));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert(`${ExcelInfo.ClassbookDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    > 

        {/**학급 수정 모달팝업 */}                   
        <ClassinfoUpdateModal
          onClose={updateModalClose}
          open={openEdit}
          currentClassinfo={editableCode}
          search={search}
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
          title="전체 학급"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width:110}}>학기</TableCell>
                    <TableCell align="center" style={{width:60}}>부서</TableCell>
                    <TableCell align="center" style={{width:60}}>학년</TableCell>
                    <TableCell align="center" style={{width:60}}>반</TableCell>
                    <TableCell align="center" style={{width:80}}>시간구분</TableCell>
                    <TableCell align="center" style={{width:60}}>유형</TableCell>
                    <TableCell align="center" style={{width:60}}>교실</TableCell>
                    <TableCell align="center" style={{width:90}}>담임</TableCell>
                    <TableCell align="center" style={{width:60}}>정원</TableCell>
                    <TableCell align="center" style={{width:60}}>재적</TableCell>
                    <TableCell align="center" style={{width:90}}>상태</TableCell>
                    <TableCell align="center" style={{width:50}}>수정</TableCell>
                    <TableCell align="center" style={{width:50}}>종강</TableCell>
                    <TableCell align="center" style={{width:170}}>학생 재배정 및 관리</TableCell>
                    <TableCell align="center" style={{width:100}}>출석부</TableCell>
                    <TableCell align="center" style={{width:100}}>주소록</TableCell>
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
                      <TableCell align="center">
                        <HtmlTooltip title={
                          <React.Fragment>
                            <Typography color="inherit">              
                                <b>{classinfo.classId}</b><br/>
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <Button>{classinfo.semesterName}</Button>
                        </HtmlTooltip>                      
                      </TableCell>
                      <TableCell align="center">{classinfo.departmentName}</TableCell>
                      <TableCell align="center">{classinfo.gradeName}</TableCell>
                      <TableCell align="center">{classinfo.classNoName}</TableCell>
                      <TableCell align="center">{classinfo.classTimeName}</TableCell>
                      <TableCell align="center">{classinfo.classTypeName}</TableCell>
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
                          onClick={() => endClassinfo(classinfo)}
                        > 종강
                        </Button>      
                      </TableCell>
                      <TableCell align="center">  
                        <Button
                          color="primary"
                          component={RouterLink}
                          to={"/kurs/operclass/view/" + classinfo.classId + "/" + classinfo.classType}
                          variant="outlined"
                        >
                          학생 재배정 및 관리
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => printClassbook(classinfo)}
                        > 출석부
                        </Button>      
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => printAddresses(classinfo)}
                        > 주소록
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

Results.propTypes = {
  className: PropTypes.string,
  classinfos: PropTypes.array
};

Results.defaultProps = {
  classinfos: []
};

export default Results;
