import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, makeStyles } from '@material-ui/styles';
import Proxy       from '../../../utils/Proxy';
import Tooltip from "@material-ui/core/Tooltip";
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  Typography,
  TableCell
} from '@material-ui/core';
import CommonCode from '../../../utils/CommonCode';
import DataExtract from '../../../utils/DataExtract';
import Valid from '../../../utils/Valid';

/**
 * 툴팁에 적용되는 스타일
 */
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 240,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1400,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  selectBox:{
    height: 42,
    width:100,
  },
  textField:{
    width:120
  },
  dateField: {
    '& + &': {
      width: 140,
      marginLeft: theme.spacing(2)
    }
  },
  point: {
    width:10,
    fontSize: 24,
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
}));

/**
 * 학기 추가 모달
 * @param {*} param0 
 */
function SemesterInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/api/semester/save/valid?' + query);
    const body = await response.json();
    return body;
  }
  
 /**
  * 학기 신규 저장
  */ 
 const saveNewSemester = () => {

  let form = document.forms['form'];  
  const url = '/api/semester/save';
  const formData = new FormData();  
  const semesterYear = DataExtract.getSelectedValue( form.semesterYear);
  const semesterType = DataExtract.getSelectedValue( form.semesterType);

  if(!semesterYear){
    alert("연도를 선택하지 않았습니다.")
    return;
  }

  if(!semesterType){
    alert("학기구분을 선택하지 않았습니다.")
    return;
  }

  //등록 가능여부 검사
  let query = '';    
      query += 'semesterYear=' + semesterYear + '&';
      query += 'semesterType=' + semesterType ;
  callApi(query)
  .then(response => {
    if(!!response.valid && response.valid === "Y"){
      /////////////////////////
      formData.append('semesterId', new String(semesterYear) + new String(semesterType));  
      formData.append('semesterName', `${semesterYear}년 ${semesterType}학기`);  
      formData.append('startDate', DataExtract.getDateString(form.startDate.value));  
      formData.append('endDate', DataExtract.getDateString(form.endDate.value));  
      formData.append('receiptStartDate', DataExtract.getDateString(form.receiptStartDate.value));
      formData.append('receiptEndDate', DataExtract.getDateString(form.receiptEndDate.value));
      formData.append('schoolDaysCount', form.schoolDaysCount.value);  
      formData.append('creId', 'root');  
       
      const config = {
          headers : {'content-type' : 'multipart/form-data'},
          proxy: Proxy.ProxyConfig
      }
    
      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert('저장 성공');
            search();
            onClose();
          }else{
            alert('저장 실패');
          }
      });
      /////////////////////////
    }else{
      alert(`${semesterYear}년 ${semesterType}학기는 이미 등록되었습니다.`);
    }
  })
  .catch(err => {
    alert(`${semesterYear}년 ${semesterType}학기 등록을 실패하였습니다.`);
    console.log(err);
  });
  //등록가능여부 검사
 }//saveNewSemester

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="form">
          <CardHeader title="신규 학기 생성" />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>연도</TableCell>
                  <TableCell>
                      <select
                        name="semesterYear"
                        id="semesterYear"
                        className={classes.selectBox}
                      >       
                      <CommonCode superCode="SEMESTER_YEAR" placeHolder="연도"/>                
                      </select>
                  </TableCell>
                  <TableCell>학기구분</TableCell>
                  <TableCell>
                    <select
                      name="semesterType"
                      id="semesterType"
                      className={classes.selectBox}
                    >                    
                    <CommonCode superCode="SEMESTER_TYPE" placeHolder="학기구분"/>    
                    </select>
                  </TableCell>
                  <TableCell>시작일자</TableCell>
                  <TableCell>     
                    <TextField
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue=""
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />    
                  </TableCell>
                  <TableCell>종료일자</TableCell>
                  <TableCell>    
                    <TextField
                      id="endDate"
                      name="endDate"
                      type="date"
                      defaultValue=""
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> 
                  </TableCell>
                  <TableCell>수업일수</TableCell>
                  <TableCell>
                    <TextField
                      name="schoolDaysCount"
                      id="schoolDaysCount"
                      variant="outlined"
                      placeholder="숫자만 입력"
                      onChange={(event) => Valid.onlyNumber(event, 3, '수업일수')}
                      className={classes.textField}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan="4" align="right">수업료 수납</TableCell>
                  <TableCell>
                    <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"방학을 포함학 실제로 수업료 수납을 시작하는 날로서 수업료 납부와 연관됨"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>시작일자</u></Button>
                      </HtmlTooltip>
                  </TableCell>
                  <TableCell>    
                    <TextField
                      id="receiptStartDate"
                      name="receiptStartDate"
                      type="date"
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> 
                  </TableCell>
                  <TableCell>
                    <HtmlTooltip title={
                        <React.Fragment>
                          <Typography color="inherit">              
                              <b>{"방학을 포함학 실제로 수업료 수납을 종료하는 날로서 수업료 납부와 연관됨"}</b><br/>
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <Button><u>종료일자</u></Button>
                      </HtmlTooltip>
                  </TableCell>
                  <TableCell>    
                    <TextField
                      id="receiptEndDate"
                      name="receiptEndDate"
                      type="date"
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> 
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
             </Table>
            
          </CardContent>
          <Divider />
          <CardActions className={classes.actions}>
            <Button 
              color="primary"
              onClick={onClose}
              variant="contained">
              닫기
            </Button>
            <Button
              color="primary"
              onClick={saveNewSemester}
              variant="contained"
            >
              저장
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

SemesterInsertModal.propTypes = {
    className: PropTypes.string,
    onSaveAndClose: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  SemesterInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
    onSaveAndClose: () => {}
  };  

export default SemesterInsertModal;
