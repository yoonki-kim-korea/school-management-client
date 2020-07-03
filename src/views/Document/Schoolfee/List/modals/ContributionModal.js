import React from 'react';
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
 * 기부금영수증 모달
 * @param {*} param0 
 */  
function ContributionModal({ open, onClose, payment, issued, comment, search, className, ...rest }) {
    const classes = useStyles();

    //조회하여 결과가 나온 후 처음 모달을 열었을 때 값이 비어진 체 있는 문제로 추가한 코드
    if(document.getElementById('fatherName')) document.getElementById('fatherName').value = payment.fatherName;
    if(document.getElementById('fatherNameEng')) document.getElementById('fatherNameEng').value = payment.fatherNameEng;
    if(document.getElementById('motherName')) document.getElementById('motherName').value = payment.motherName;
    if(document.getElementById('motherNameEng')) document.getElementById('motherNameEng').value = payment.motherNameEng;
    /**
     * 학생정보의 부모성명 저장
     */  
  const update = () => {

    let form = document.forms['form'];  
    const url = '/api/student/parents/name/update';
    const formData = new FormData();

    //부모창의 객체의 값도 변경해준다.
    payment.fatherName = form.fatherName.value;
    payment.fatherNameEng = form.fatherNameEng.value;
    payment.motherName = form.motherName.value;
    payment.motherNameEng = form.motherNameEng.value;  
    
    formData.append('studentId', payment.studentId);
    formData.append('studentNo', payment.studentNo);
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
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }

  /**
   * 출력 버튼 클릭
   */  
  const print = async () => {
    let document = await getDocument();
    makeExcel(document);
  }

  /**
   * 문서 정보 조회
   */
  const getDocument = async () => {      
    let documentInfo;
    let query = `/api/document/info?documentId=CONTRIBUTION`; 
      await callApi(query)
      .then(response => {
        if(response.documents.length == 0){
          console.log(`문서정보 조회 실패. documentId=CONTRIBUTION`);
        }        
        documentInfo = response.documents;
      })
      .catch(err => console.log(err));
      return documentInfo
  }

  /**
   * 기부금영수증 엑셀 변환
   * @param {*} documentInfo 
   */
  const makeExcel = (documentInfo) => {
    const url = '/api/print/excel/contribution';
    const formData = new FormData();    console.log(JSON.stringify(documentInfo))
    formData.append('documentInfo', JSON.stringify(documentInfo));

    formData.append('issued', JSON.stringify(issued));  
    payment.creId = 'root';

    if(document.getElementById('applicant1').checked){
      payment.applicant = document.getElementById('fatherName').value;
    }else if(document.getElementById('applicant2').checked){ 
      payment.applicant = document.getElementById('fatherNameEng').value; 
    }else if(document.getElementById('applicant3').checked){
      payment.applicant = document.getElementById('motherName').value;  
    }else if(document.getElementById('applicant4').checked){ 
      payment.applicant = document.getElementById('motherNameEng').value;  
    } 

    formData.append('payment', JSON.stringify(payment));  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        if(response.data.result === "success"){            
          alert(`${ExcelInfo.ContributionDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
        onClose();
    });
  }//makeExcel

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
              <CardHeader title="기부금 영수증 발급" />
              <CardContent>                
                  <Table>
                      <TableBody>
                            <TableRow>
                                <TableCell align="left">대상자</TableCell>
                                <TableCell align="left" colSpan="5">{payment.departmentName} {payment.gradeName}  {payment.className} {payment.koreanName}</TableCell>                   
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
                                    defaultValue={payment.fatherName}
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
                                    defaultValue={payment.fatherNameEng}
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
                                    defaultValue={payment.motherName}
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
                                    defaultValue={payment.motherNameEng}
                                    className={classes.textFiled}
                                    onChange={(event) => Valid.maxLength(event, 20, '모-영어성명')}
                                  />    
                                </RadioGroup>   
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

ContributionModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  ContributionModal.defaultProps = {
    open: false,
    onClose: () => {}
  };

export default ContributionModal;