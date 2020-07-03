import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../../utils/Proxy';
import DataExtract       from '../../../../../utils/DataExtract';
import CommonCode    from '../../../../../utils/CommonCode';
import SpecialCommonCode    from '../../../../../utils/SpecialCommonCode';
import ExcelInfo     from '../../../../../utils/ExcelInfo';
import Valid from '../../../../../utils/Valid';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TextareaAutosize
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: 'none',
      boxShadow: theme.shadows[20],
      width: 1500,
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
    textFiled:{
      width:400,
    },
    radio:{
      display:'inline-block', 
      width:150
    },
    dateField: {
      '& + &': {
        width: 140,
        marginLeft: theme.spacing(2)
      }
    },
    
  }));

/**
 * 입학통지서
 * @param {*} param0 
 */
function EntranceModal({ open, onClose, editable, issued, documentInfo, search, className, ...rest }) {
    const classes = useStyles();
    
    //조회하여 결과가 나온 후 처음 모달을 열었을 때 값이 비어진 체 있는 문제로 추가한 코드
    if(document.getElementById('fatherName')) document.getElementById('fatherName').value = editable.fatherName;
    if(document.getElementById('fatherNameEng')) document.getElementById('fatherNameEng').value = editable.fatherNameEng;
    if(document.getElementById('motherName')) document.getElementById('motherName').value = editable.motherName;
    if(document.getElementById('motherNameEng')) document.getElementById('motherNameEng').value = editable.motherNameEng;
    
    /**
     * 멘트 생성
     */
    const makeComment = () => {
      let comment = DataExtract.findItemValue(documentInfo, 'content');
      let t1 = DataExtract.getSelectedText(document.getElementById('department1')) +  ' ' + DataExtract.getSelectedText(document.getElementById('grade1'));
      let t2 = t1 + ' ' + DataExtract.getSelectedText(document.getElementById('classNo1'));
      let t3 = DataExtract.getSelectedText(document.getElementById('classroom'));
      let t4 = document.getElementById('entranceDay').value;
      t4 = t4.split("-")[0] + '년 ' + t4.split("-")[1] + '월 ' + t4.split("-")[2] + '일';
      comment = comment.replace('@t1', t1);
      comment = comment.replace('@t2', t2);
      comment = comment.replace('@t3', t3);
      comment = comment.replace('@t4', t4);

      document.getElementById('comment').value = comment;
    }//makeComment

    /**
     * 학생정보의 부모성명 저장
     */  
   const update = () => {
  
    let form = document.forms['form'];  
    const url = '/api/student/parents/name/update';
    const formData = new FormData();

    //부모창의 객체의 값도 변경해준다.
    editable.fatherName = form.fatherName.value;
    editable.fatherNameEng = form.fatherNameEng.value;
    editable.motherName = form.motherName.value;
    editable.motherNameEng = form.motherNameEng.value;
    
    formData.append('studentId', editable.studentId);
    formData.append('studentNo', editable.studentNo);
    formData.append('fatherName',    form.fatherName.value);  
    formData.append('fatherNameEng', form.fatherNameEng.value);  
    formData.append('motherName',    form.motherName.value);  
    formData.append('motherNameEng', form.motherNameEng.value);  
    formData.append('updId', 'root');  
     
    const config = {
        headers : {'content-type' : 'multipart/form-data' },
        proxy: Proxy.ProxyConfig
    }
  
    post(url, formData, config, Response)
    .then(response => {
      if(response.data.result === 'success'){
        //search();
        alert('저장 성공');
      }else{
        alert('저장 실패');
      }
    });
   }//update  
    
    /**
     * 엑셀변환
     */
    const print = async () => {
      const url = '/api/print/excel/entrance';
      const formData = new FormData(); 
      formData.append('documentInfo', JSON.stringify(documentInfo));
      formData.append('issued', JSON.stringify(issued));  
      editable.comment = document.getElementById('comment').value;
      editable.creId = 'root';

      let entranceDay = document.getElementById('entranceDay').value;
      editable.receiver = entranceDay.split("-")[1] + '월 입학생 학부모';
      editable.title = entranceDay.split("-")[0] + '학년도 입학통지서';

      if(document.getElementById('applicant1').checked){
        editable.father = document.getElementById('fatherName').value;
      }else if(document.getElementById('applicant2').checked){ 
        editable.father = document.getElementById('fatherNameEng').value; 
      }
      
      if(document.getElementById('applicant3').checked){
        editable.mother = document.getElementById('motherName').value;  
      }else if(document.getElementById('applicant4').checked){ 
        editable.mother = document.getElementById('motherNameEng').value;  
      }

      formData.append('editable', JSON.stringify(editable));  

      const config = {
          headers : { 'content-type' : 'multipart/form-data'  },
          proxy: Proxy.ProxyConfig
      }

      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert(`${ExcelInfo.EntranceDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
          }else{
            alert(response.data.message);
          }
          onClose();
      });
    }

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
                <CardHeader title="입학통지서 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">대상자</TableCell>
                                <TableCell align="left" colSpan="5">{editable.departmentName} {editable.gradeName}  {editable.className} {editable.koreanName}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급일자</TableCell>
                                <TableCell align="left" colSpan="5">{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급번호</TableCell>
                                <TableCell align="left" colSpan="5">{issued.issuedDate}-{issued.documentType}-{issued.seqNo}</TableCell>                   
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">입학부서</TableCell>
                                <TableCell align="left">
                                  <select
                                    name="department1"
                                    id="department1"
                                    className={classes.selectBox}
                                    onChange={makeComment}
                                  >                    
                                    <CommonCode superCode="DEPARTMENT" placeHolder="부서"  firstSelectYn="N"/>      
                                  </select>  
                                </TableCell>
                                <TableCell align="left">학년</TableCell>
                                <TableCell align="left">
                                  <select
                                    name="grade1"
                                    id="grade1"
                                    className={classes.selectBox}
                                    onChange={makeComment}
                                  >                    
                                    <CommonCode superCode="GRADE" placeHolder="학년"  firstSelectYn="N"/>      
                                  </select>  
                                </TableCell>
                                <TableCell align="left">반</TableCell>
                                <TableCell align="left">
                                  <select
                                    name="classNo1"
                                    id="classNo1"
                                    className={classes.selectBox}
                                    onChange={makeComment}
                                  >                    
                                    <CommonCode superCode="CLASS_NO" placeHolder="반"  firstSelectYn="N"/>      
                                  </select>
                                </TableCell>                              
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">입학일자</TableCell>
                                <TableCell align="left">
                                  <TextField
                                    id="entranceDay"
                                    name="entranceDay"
                                    type="date"
                                    defaultValue={""}
                                    className={classes.dateField}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    onChange={makeComment}
                                  />    
                                </TableCell>
                                <TableCell align="left">교실</TableCell>
                                <TableCell align="left">
                                  <select
                                    name="classroom"
                                    id="classroom"
                                    className={classes.selectBox}
                                    onChange={makeComment}
                                  >                    
                                  <SpecialCommonCode specialCode="classroom" placeHolder="교실" firstSelectYn="N"/>      
                                  </select>
                                </TableCell>                              
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">학부모명</TableCell>
                                <TableCell align="left" colSpan="5">
                                  
                                  <FormGroup row name="applicant" id="applicant" style={{display:'block', width:600, border:'none'}}>

                                    <FormControlLabel
                                      value="1"    
                                      control={<Checkbox id="applicant1" color="primary"  />}
                                      label="부-한글성명"
                                    />
                                    <TextField
                                      name="fatherName"
                                      id="fatherName"
                                      variant="outlined"
                                      defaultValue={editable.fatherName}
                                      className={classes.textFiled}
                                      onChange={(event) => Valid.maxLength(event, 15, '부-한글성명')}
                                    /> 
                                    <FormControlLabel
                                      value="2" 
                                      control={<Checkbox id="applicant2" color="primary"  />}
                                      label="부-영어성명"
                                    />
                                    <TextField
                                      name="fatherNameEng"
                                      id="fatherNameEng"
                                      variant="outlined"
                                      defaultValue={editable.fatherNameEng}
                                      className={classes.textFiled}
                                      onChange={(event) => Valid.maxLength(event, 20, '부-영어성명')}
                                    />   
                                    <FormControlLabel
                                      value="3"    
                                      control={<Checkbox id="applicant3" color="primary"  />}
                                      label="모-한글성명"
                                    />
                                    <TextField
                                      name="motherName"
                                      id="motherName"
                                      variant="outlined"
                                      defaultValue={editable.motherName}
                                      className={classes.textFiled}
                                      onChange={(event) => Valid.maxLength(event, 15, '모-한글성명')}
                                    /> 
                                    <FormControlLabel
                                      value="4"    
                                      control={<Checkbox id="applicant4" color="primary"  />}
                                      label="모-영어성명"
                                    />
                                    <TextField
                                      name="motherNameEng"
                                      id="motherNameEng"
                                      variant="outlined"
                                      defaultValue={editable.motherNameEng}
                                      className={classes.textFiled}
                                      onChange={(event) => Valid.maxLength(event, 20, '모-영어성명')}
                                    />    
                                  </FormGroup>
                                  
                                </TableCell>         
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">내용</TableCell>
                                <TableCell align="left" colSpan="5">                   
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      defaultValue={DataExtract.findItemValue(documentInfo, 'content')}
                                      rows={4}
                                      rowsMax={10}
                                      aria-label="maximum height"
                                      style={{width:800,height:150}}
                                    />
                                </TableCell>                    
                            </TableRow>
                        </TableBody>
                    </Table>

                </CardContent>
                <Divider />
                <CardActions className={classes.actions}>
                     <Button color="primary"
                            variant="contained"
                          onClick={() => update()}>
                    신청자명 저장
                    </Button>
                     <Button color="primary"
                            variant="contained"
                            onClick={onClose}>
                    닫기
                    </Button>
                     <Button color="primary"
                            variant="contained"
                          onClick={() => print()}>
                    출력
                    </Button>
                </CardActions>
              </form>
            </Card>            
        </Modal>
    );
}


EntranceModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  EntranceModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  


export default EntranceModal;