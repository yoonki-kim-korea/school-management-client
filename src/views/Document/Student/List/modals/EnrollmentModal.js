import React  from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../../../utils/Proxy';
import DataExtract       from '../../../../../utils/DataExtract';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    
  }));

/**
 * 재학증명서
 * @param {*} param0 
 */
function EnrollmentModal({ open, onClose, editable, issued, documentInfo, search, className, ...rest }) {
    const classes = useStyles();
    
    //조회하여 결과가 나온 후 처음 모달을 열었을 때 값이 비어진 체 있는 문제로 추가한 코드
    if(document.getElementById('fatherName')) document.getElementById('fatherName').value = editable.fatherName;
    if(document.getElementById('fatherNameEng')) document.getElementById('fatherNameEng').value = editable.fatherNameEng;
    if(document.getElementById('motherName')) document.getElementById('motherName').value = editable.motherName;
    if(document.getElementById('motherNameEng')) document.getElementById('motherNameEng').value = editable.motherNameEng;
   
    const makeComment = (template) => {
      if(template === undefined || template === null) return '';
      if(editable.studentStatus === 'STD'){
        //Hiermit wird bestätigt, dass @t1 (geb. am @t2, Schulnummer @t3) seit @t4 die Koreanische Schule in Frankfurt/M besucht
        template = template.replace('@t1', editable.germanName);
        template = template.replace('@t2', DataExtract.getFommatedDate2(editable.birthday, "."));
        template = template.replace('@t3', editable.studentNo);
        template = template.replace('@t4', DataExtract.getFommatedDate2(editable.entranceDay, "."));
        return template;
      }else if(editable.studentStatus === 'LEV' || editable.studentStatus === 'GRD'){
        //Hiermit wird bescheinigt, dass @t1 (geb. am @t2, Schulnummer @t3) von @t4 bis @t5 die Koreanische Schule in Frankfurt/M besucht hat
        template = template.replace('@t1', editable.germanName);
        template = template.replace('@t2', DataExtract.getFommatedDate2(editable.birthday, "."));
        template = template.replace('@t3', editable.studentNo);
        template = template.replace('@t4', DataExtract.getFommatedDate2(editable.entranceDay, "."));
        template = template.replace('@t5', DataExtract.getFommatedDate2(editable.inputDate, "."));
        return template;
      }
    }

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
      const url = '/api/print/excel/enrollment';
      const formData = new FormData(); 
      formData.append('documentInfo', JSON.stringify(documentInfo));
      formData.append('issued', JSON.stringify(issued));  
      editable.comment = document.getElementById('comment').value;
      editable.creId = 'root';

      if(document.getElementById('applicant1').checked){
        editable.applicant = document.getElementById('fatherName').value;
      }else if(document.getElementById('applicant2').checked){ 
        editable.applicant = document.getElementById('fatherNameEng').value; 
      }else if(document.getElementById('applicant3').checked){
        editable.applicant = document.getElementById('motherName').value;  
      }else if(document.getElementById('applicant4').checked){ 
        editable.applicant = document.getElementById('motherNameEng').value;  
      }

      formData.append('editable', JSON.stringify(editable));  

      const config = {
          headers : { 'content-type' : 'multipart/form-data'  },
          proxy: Proxy.ProxyConfig
      }

      post(url, formData, config, Response)
      .then(response => {
          if(response.data.result === "success"){            
            alert(`${ExcelInfo.EmploymentDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
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
                <CardHeader title="재학 증명서 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">대상자</TableCell>
                                <TableCell align="left" >{editable.departmentName} {editable.gradeName}  {editable.className} {editable.koreanName}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급일자</TableCell>
                                <TableCell align="left">{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">발급번호</TableCell>
                                <TableCell align="left">{issued.issuedDate}-{issued.documentType}-{issued.seqNo}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">신청자명</TableCell>
                                <TableCell align="left">
                                  <RadioGroup aria-label="position" name="applicant" id="applicant" style={{display:'block', width:600, border:'none'}}>
      
                                    <FormControlLabel
                                      value="1"    
                                      control={<Radio id="applicant1" color="primary" />}
                                      label="부-한글성명"
                                      labelPlacement="bottom"
                                      className={classes.radio}
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
                                      control={<Radio id="applicant2" color="primary" />}
                                      label="부-영어성명"
                                      labelPlacement="bottom"
                                      className={classes.radio}
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
                                      control={<Radio id="applicant3" color="primary" />}
                                      label="모-한글성명"
                                      labelPlacement="bottom"
                                      className={classes.radio}
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
                                      control={<Radio id="applicant4" color="primary" />}
                                      label="모-영어성명"
                                      labelPlacement="bottom"
                                      className={classes.radio}
                                    />
                                    <TextField
                                      name="motherNameEng"
                                      id="motherNameEng"
                                      variant="outlined"
                                      defaultValue={editable.motherNameEng}
                                      className={classes.textFiled}
                                      onChange={(event) => Valid.maxLength(event, 20, '모-영어성명')}
                                    />    
                                  </RadioGroup>   
                                </TableCell>         
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">내용</TableCell>
                                <TableCell align="left">  
                                  {editable.studentStatus === 'STD' ?                  
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      rows={4}
                                      rowsMax={10}
                                      aria-label="maximum height"
                                      defaultValue={makeComment(DataExtract.findItemValue(documentInfo, 'comment1'))}
                                      style={{width:800,height:150}}
                                    />
                                    :              
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      rows={4}
                                      rowsMax={10}
                                      aria-label="maximum height"
                                      defaultValue={makeComment(DataExtract.findItemValue(documentInfo, 'comment2'))}
                                      style={{width:800,height:150}}
                                    />
                                    }
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


EnrollmentModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  EnrollmentModal.defaultProps = {
    open: false,
    onClose: () => {}
  };  


export default EnrollmentModal;