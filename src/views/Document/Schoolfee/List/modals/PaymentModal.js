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
 * 납입증명서 모달
 * @param {*} param0 
 */
function PaymentModal({ open, onClose, payment, issued, search, documentInfo, className, ...rest }) {
    const classes = useStyles();

    //조회하여 결과가 나온 후 처음 모달을 열었을 때 값이 비어진 체 있는 문제로 추가한 코드
    if(document.getElementById('fatherName')) document.getElementById('fatherName').value = payment.fatherName;
    if(document.getElementById('fatherNameEng')) document.getElementById('fatherNameEng').value = payment.fatherNameEng;
    if(document.getElementById('motherName')) document.getElementById('motherName').value = payment.motherName;
    if(document.getElementById('motherNameEng')) document.getElementById('motherNameEng').value = payment.motherNameEng; 

    /**
     * 납입증명서 상의 내용 생성
     * @param {*} template 
     */
    const makeComment = (template) => {
      if(!template) return;
      template = template.replace('@t1', payment.germanName);
      template = template.replace('@t2', DataExtract.getFommatedDate2(payment.birthday, "."));
      template = template.replace('@t3', payment.gender === 'M' ? 'Mann':'Frau');
      template = template.replace('@t4', payment.studentNo);
      return template;
    }

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
     * 출력버튼 클릭
     */
    const print = async () => {
      const url = '/api/print/excel/payment';
      const formData = new FormData();
  
      //부모창의 객체의 값도 변경해준다.
      let form = document.forms['form']; 
      payment.fatherName = form.fatherName.value;
      payment.fatherNameEng = form.fatherNameEng.value;
      payment.motherName = form.motherName.value;
      payment.motherNameEng = form.motherNameEng.value;
      
      formData.append('documentInfo', JSON.stringify(documentInfo));

      if(document.getElementById('admissionFee1').checked){
        payment.admissionFeeYn = "N";
      }else if(document.getElementById('admissionFee2').checked){
        payment.admissionFeeYn = "Y";
      }

      formData.append('issued', JSON.stringify(issued));  
      payment.comment = document.getElementById('comment').value;
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
            alert(`${ExcelInfo.PpaymentDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
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
                <CardHeader title="납입 증명서 발급" />
                <CardContent>                
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center" style={{width:300}}>대상자</TableCell>
                                <TableCell align="left">{payment.departmentName} {payment.gradeName}  {payment.className} {payment.koreanName}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">발급일자</TableCell>
                                <TableCell align="left">{DataExtract.getFommatedDate2(issued.issuedDate, '.')} </TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">발급번호</TableCell>
                                <TableCell align="left">{issued.issuedDate}-{issued.documentType}-{issued.seqNo}</TableCell>                   
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">신청자명</TableCell>
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
                            <TableRow>
                                <TableCell align="center">입학금</TableCell>
                                <TableCell align="left">                                  
                                  <RadioGroup aria-label="position" name="admissionFee" id="admissionFee" style={{display:'block', width:600, border:'none'}}>
                                    <FormControlLabel
                                        value="0"  
                                        control={<Radio id="admissionFee1" color="primary" />}
                                        label="미포함"
                                        labelPlacement="bottom"
                                        className={classes.radio}
                                      />
                                      <FormControlLabel
                                          value={payment.admissionFee}  
                                          control={<Radio id="admissionFee2" color="primary" />}
                                          label="포함"
                                          labelPlacement="bottom"
                                          className={classes.radio}
                                        />
                                        {DataExtract.money(payment.admissionFee) + ' Euro'} (입학일자: {DataExtract.getFommatedDate(payment.entranceDay, '-')})
                                  </RadioGroup>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">내용</TableCell>
                                <TableCell align="left">                   
                                    <TextareaAutosize
                                      name="comment"
                                      id="comment"
                                      rows={4}
                                      rowsMax={5}
                                      aria-label="maximum height"
                                      defaultValue={makeComment(DataExtract.findItemValue(documentInfo, 'comment'))}
                                      style={{width:800,height:80}}
                                    />
                                </TableCell>                    
                            </TableRow>

                            <TableRow>
                              <TableCell align="right">in der Zeit</TableCell>
                              <TableCell align="left">
                                {DataExtract.getDuration()}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell align="right">das Schulgeld in Hoehe</TableCell>
                              <TableCell align="left">
                                {DataExtract.money(payment.fee1) + ' EUR'}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell align="right">die Aufnahmegebuehr in Hoehe ins Gesamt</TableCell>
                              <TableCell align="left">
                                 {DataExtract.money(payment.admissionFee) + ' EUR'}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell align="right">ins Gesamt</TableCell>
                              <TableCell align="left">
                                {DataExtract.money(parseFloat(payment.fee1) + parseFloat(payment.admissionFee)) + ' EUR'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="right"></TableCell>
                              <TableCell align="left">
                               {DataExtract.findItemValue(documentInfo, 'end')}
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

PaymentModal.propTypes = {
    className: PropTypes.string,
    editableSchoolfee: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};

PaymentModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default PaymentModal;