import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField
} from '@material-ui/core';
import CommonCode from '../../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../../utils/SpecialCommonCode';
import DataExtract from '../../../../../utils/DataExtract';
import TrandeStudentResult from './TrandeStudentResult';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1300,
    height:800,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  selectBox:{
    height: 42,
    width:120,
  },
  textFieldNum:{
    width:80
  }
}));

/**
 * 운영학급관리 > 학생 재배정 및 관리 > 학급 이동 모달
 * @param {*} param0 
 */
function TradeStudentModal({ open, search, onClose, student, className, ...rest }) {
  const classes = useStyles();
  const [classinfos, setClassinfos] = useState([]);
  
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/operclass/list?' + query);
    const body = await response.json();
    return body;
  }

 /**
  * 이동할 학급 검색
  */ 
 const searchClasses = () => {    
    let form = document.forms['form'];
    let query  = 'semester='   + DataExtract.getSelectedValueWithAlternative( form.semester, '') + '&';
        query += 'department=' + DataExtract.getSelectedValueWithAlternative( form.department, '') + '&';
        query += 'grade='      + DataExtract.getSelectedValueWithAlternative( form.grade, '') + '&';
        query += 'classNo='    + DataExtract.getSelectedValueWithAlternative( form.classNo, '') + '&';    
        query += 'classType='  + DataExtract.getSelectedValueWithAlternative( form.classType, '') + '&';    
        query += 'classTime='  + DataExtract.getSelectedValueWithAlternative( form.classTime, '') + '&'; 
        query += 'teacher='    + DataExtract.getSelectedValueWithAlternative( form.teacher, '');
        
    callApi(query)
    .then(response => {
    if(response.classbooks.length == 0){
        alert("조회할 정보가 없습니다.");
        }
        setClassinfos(response.classbooks);
    })
    .catch(err => console.log(err));
 }//saveNewClassinfo

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
          <CardHeader title="이동할 학급 목록" />
          <Divider />
          <CardContent>
        <form id="form">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>학기</TableCell> 
                  <TableCell>
                      <select
                        name="semester"
                        id="semester"
                        className={classes.selectBox}
                      >       
                      <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="N"/>                
                      </select>
                  </TableCell>
                  <TableCell>부서</TableCell>
                  <TableCell>
                    <select
                      name="department"
                      id="department"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="DEPARTMENT" placeHolder="부서" firstSelectYn="N"/>      
                    </select>
                  </TableCell>
                  <TableCell>학년</TableCell>
                  <TableCell>
                    <select
                      name="grade"
                      id="grade"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="GRADE" placeHolder="학년" firstSelectYn="N"/>    
                    </select>
                  </TableCell>
                  <TableCell>반</TableCell>
                  <TableCell>
                    <select
                      name="classNo"
                      id="classNo"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="CLASS_NO" placeHolder="반" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell colSpan="3">
                    <select
                      name="classType"
                      id="classType"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="CLASS_TYPE" placeHolder="유형" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>시간구분</TableCell>
                  <TableCell>
                    <select
                      name="classTime"
                      id="classTime"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="CLASS_TIME" placeHolder="시간구분" firstSelectYn="N" />    
                    </select>
                  </TableCell>
                  <TableCell>담임</TableCell>
                  <TableCell>
                    <select
                      name="teacher"
                      id="teacher"
                      className={classes.selectBox}
                    >                    
                    <SpecialCommonCode specialCode="teacher" placeHolder="담임" firstSelectYn="N"/>   
                    </select>
                  </TableCell>

                  <TableCell colSpan="5"> 
                    <Button
                      color="primary"
                      onClick={searchClasses}
                      variant="contained"
                      style={{marginRight:'5px'}}
                      >
                      검색
                    </Button>                      
                    <Button 
                      color="primary"
                      variant="contained"
                      onClick={() => {setClassinfos([]); onClose(); }}>
                    닫기
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan="3">현재학급 수강중단일</TableCell>
                  <TableCell colSpan="2">                    
                  <TextField
                        id="endDateOfNext"
                        name="endDateOfNext"
                        type="date"
                        defaultValue={DataExtract.today("-")}
                        className={classes.dateField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />      
                  </TableCell>
                  <TableCell colSpan="3">옮길 학급 수강시작일</TableCell>
                  <TableCell colSpan="2">                   
                    <TextField
                        id="startDateOfCurrent"
                        name="startDateOfCurrent"
                        type="date"
                        defaultValue={DataExtract.today("-")}
                        className={classes.dateField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />      
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </form>            
          </CardContent>
          <Divider />
        <div>
          <TrandeStudentResult
            className={classes.results}
            classinfos={classinfos}
            student={student}
            search={search} 
            onClose={onClose}
          />
        </div>
      </Card>
    </Modal>
  );
}

TradeStudentModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  TradeStudentModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  

export default TradeStudentModal;
