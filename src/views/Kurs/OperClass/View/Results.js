import React, { useState } from 'react';
import {post} from 'axios';
import { Link as RouterLink } from 'react-router-dom';
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
  TableRow,
  Typography
} from '@material-ui/core';
import AbandonClassModal from './modals/AbandonClassModal';
import TradeStudentModal from './modals/TradeStudentModal';
import LeaveAbsenseModal from './modals/LeaveAbsenseModal'
import Proxy       from '../../../../utils/Proxy';
import CommonCode from '../../../../utils/CommonCode';

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
  selectBox:{
    height: 42,
    width:120,
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

/**
 * 운영학급관리 > 학생 재배정 및 관리 
 * @param {*} param0 
 */
function Results({ className, classType, students, search,  ...rest }) {
  const classes = useStyles();
  
  const [openEdit, setOpenEdit] = useState(false);  //휴학
  const [openAbandonClass, setOpenAbandonClass] = useState(false);
  const [openTradeStudent, setOpenTradeStudent] = useState(false);
  const [student, setStudent]= useState(false);
  
  /**
   * 수강중단 모달 열기
   * @param {*} studentId 
   * @param {*} classId 
   */
  const abandonClass = (student) => {
    setOpenAbandonClass(true);  
    setStudent(student)
  }

  /**
   * 수강중단 모달 닫기
   */
  const closeAbandonClass = () => {
    setOpenAbandonClass(false); 
  }
  
  /**
   * 휴학 모달 열기
   * @param {*} editable 
   */
  const leaveAbsenseOpen = (editable) => {
    setOpenEdit(true);    
    setStudent(editable);
  }

  /**
   * 휴학 모달 닫기
   */
  const leaveAbsenseClose = () => {
    setOpenEdit(false); 
  }


  const closeOpenTradeStudent = () => {
    setOpenTradeStudent(false);  
  }

  /**
   * 학급 이동
   * @param {*} student 
   */
  const tradeStudent = (student) => {
    if(!window.confirm(`${student.koreanName}를 다른 반으로 이동시키겠습니까?`)){
      return;
    }
    
    setOpenTradeStudent(true);    
    setStudent(student);
  }//tradeStudent

  /**
   * 수료여부, 감면사유 셀렉트박스 변경할 때 저장
   * @param {*} method 
   * @param {*} studentId 
   * @param {*} classId 
   * @param {*} value 
   */
  const save = (method, studentId, classId, value) => {
    const url = '/api/operclass/student/update';
    const formData = new FormData();
    switch(method){
      case 'completeYn': formData.append('completeYn', value); break;
      case 'reduction': formData.append('reduction', value); break;
    }
      
    formData.append('studentId', studentId);  
    formData.append('classId', classId);  
    formData.append('udpId', 'root');  
   
    const config = {
        headers : { 'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }
    post(url, formData, config, Response)
      .then(response => {
        if(response.data.result === "success"){            
          console.log('수정 성공');
        }else{
          console.log('수정 실패');
        }
    });
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >        
        {/** 수업중단 모달 팝업 */}                  
        <AbandonClassModal
          onClose={closeAbandonClass}
          open={openAbandonClass}
          student={student}
          search={search}
        /> 

        {/** 학급이동 모달  */}
        <TradeStudentModal 
          open={openTradeStudent}
          onClose={closeOpenTradeStudent}
          student={student}
          search={search}
        />
        
        {/**휴학 모달팝업 */}                   
        <LeaveAbsenseModal
          onClose={leaveAbsenseClose}
          open={openEdit}
          editable={student}
          search={search}
        /> 

      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        전체{' '}{students.length}{' 명'}
      </Typography>
      <Card>
        <CardHeader
          title="수강 학생목록"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>학번</TableCell>
                    <TableCell>한글성명</TableCell>
                    <TableCell>수료여부</TableCell>
                    <TableCell>감면사유</TableCell>
                    <TableCell align="center">메모</TableCell>
                    <TableCell align="center">{classType === 'R' ? '휴학' : '수강중단'}</TableCell>
                    <TableCell align="center">학급 이동</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow
                      hover
                      key={index}
                    >
                      <TableCell>{student.studentNo}</TableCell>
                      <TableCell>{student.koreanName}</TableCell>
                      <TableCell>
                          <select name="completeYn"
                                  id="completeYn"
                                  className={classes.selectBox}
                                  onChange={(event)=>{save('completeYn', student.studentId, student.classId, event.target.value)}} >                    
                            <CommonCode superCode="COMPLETE_YN" placeHolder="수료여부" firstSelectYn="Y" selectedValue={student.completeYn}/>      
                          </select>
                      </TableCell>
                      <TableCell>
                          <select name="reduction"
                                  id="reduction"
                                  className={classes.selectBox}
                                  onChange={(event)=>{save('reduction', student.studentId, student.classId, event.target.value)}}>                    
                            <CommonCode superCode="REDUCTION_TYPE" placeHolder="수업료 감면사유" firstSelectYn="Y" selectedValue={student.reduction}/>      
                          </select>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          id="btn"
                          color="primary"
                          variant="outlined"                          
                          component={RouterLink}
                          to={"/kurs/diary/list/" + student.studentId}
                        > 메모
                        </Button> 
                      </TableCell>
                      <TableCell align="center">
                      {classType === 'R' ? 
                        <Button
                        id="btn"
                        color="primary"
                        variant="outlined"
                        onClick={() => leaveAbsenseOpen(student)}
                      > 휴학
                      </Button> 
                       : 
                       <Button
                          id="btn"
                          color="primary"
                          variant="outlined"
                          onClick={() => abandonClass(student)}
                        > 수강중단
                        </Button> 
                       }
                        
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => tradeStudent(student)}
                        > 학급 이동
                        </Button>      
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
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
  students: PropTypes.array
};

Results.defaultProps = {
  students: []
};

export default Results;
