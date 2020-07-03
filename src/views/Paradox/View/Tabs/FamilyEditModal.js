import React from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import CommonCode  from '../../../../utils/CommonCode';
import Proxy       from '../../../../utils/Proxy';
import Valid       from '../../../../utils/Valid';
import DataExtract from '../../../../utils/DataExtract';
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
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 800,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  selectBox1 : {
    width: 150,
    height:40,
    display: 'inline-block',
    alignItems: 'left'

  }
}));


function FamilyEditModal({ open, onSaveAndClose, onClose, student, className, ...rest }) {
  const classes = useStyles();

 /**
  * 저장
  */ 
 const updateStudentFamily = () => {

  let form = document.forms['form'];  
  const url = '/api/student/family/update';
  const formData = new FormData();
  
  formData.append('studentId', student.studentId);
  formData.append('studentNo', student.studentNo);

  if(!!form.fatherName.value){
    formData.append('fatherName', DataExtract.getEmpty(form.fatherName.value));  
    student.fatherName = DataExtract.getEmpty(form.fatherName.value);
  }

  if(!!form.fatherNameEng.value){
    formData.append('fatherNameEng', DataExtract.getEmpty(form.fatherNameEng.value));  
    student.fatherNameEng = DataExtract.getEmpty(form.fatherNameEng.value);
  }

  if(!!form.fatherPhoneNo.value){
    formData.append('fatherPhoneNo', DataExtract.getEmpty(form.fatherPhoneNo.value));  
    student.fatherPhoneNo = DataExtract.getEmpty(form.fatherPhoneNo.value);
  }
  
  if(!!form.motherName.value){
    formData.append('motherName', DataExtract.getEmpty(form.motherName.value));  
    student.motherName = DataExtract.getEmpty(form.motherName.value);
  }

  if(!!form.motherNameEng.value){
    formData.append('motherNameEng', DataExtract.getEmpty(form.motherNameEng.value));  
    student.motherNameEng = DataExtract.getEmpty(form.motherNameEng.value);
  }

  if(!!form.motherPhoneNo.value){
    formData.append('motherPhoneNo', DataExtract.getEmpty(form.motherPhoneNo.value));  
    student.motherPhoneNo = DataExtract.getEmpty(form.motherPhoneNo.value);
  }

  if(student.representYn !== DataExtract.getSelectedValue(form.representYn)){  
    formData.append('representYn', DataExtract.getSelectedValue(form.representYn));
    student.representYn = DataExtract.getSelectedValue(form.representYn);
  }
  
  if(student.bank !== DataExtract.getSelectedValue(form.bank)){  
    formData.append('bank', DataExtract.getSelectedValue(form.bank)); 
    student.bank = DataExtract.getSelectedValue(form.bank);
    student.bankStr = DataExtract.getSelectedText(form.bank);
  }

  if(!!form.accountNo.value){
    formData.append('accountNo', form.accountNo.value);  
    student.accountNo = DataExtract.getEmpty(form.accountNo.value);
  }

  if(!!form.accountHolder.value){
    formData.append('accountHolder', form.accountHolder.value);  
    student.accountHolder = DataExtract.getEmpty(form.accountHolder.value);
  }

  if(!!form.iban.value){
    formData.append('iban', form.iban.value);
    student.iban = DataExtract.getEmpty(form.iban.value);  
  }

  if(!!form.bic.value){
    formData.append('bic', form.bic.value);
    student.bic = DataExtract.getEmpty(form.bic.value);
  }
  formData.append('updId', 'root');  
   
  const config = {
      headers : {'content-type' : 'multipart/form-data' },
      proxy: Proxy.ProxyConfig
  }

  post(url, formData, config, Response)
  .then(response => {
    if(response.data.result === 'success'){
      alert('저장 성공');
      onSaveAndClose(student);
    }else{
      alert('저장 실패');
    }
  });
 }//updateStudentFamily
  
  return (
    <Modal
      onSaveAndClose={onSaveAndClose}
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id="form">
          <CardHeader title="학생 기본정보 수정" />
          <Divider />
          <CardContent>
            <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>성명(한글)</TableCell>
                    <TableCell>성명(영문)</TableCell>
                    <TableCell>관계</TableCell>
                    <TableCell>핸드폰</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField
                        name="fatherName"
                        id="fatherName"
                        placeholder="최대 15자"
                        defaultValue={student.fatherName}
                        onChange={(event) => Valid.maxLength(event, 15, '부-성명(한글)')}
                        variant="outlined"
                      />                      
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="fatherNameEng"
                        id="fatherNameEng"
                        placeholder="최대 20자"
                        defaultValue={student.fatherNameEng}
                        onChange={(event) => Valid.maxLength(event, 20, '부-성명(영문)')}
                        variant="outlined"
                      />                      
                    </TableCell>
                    <TableCell>부</TableCell>
                    <TableCell>
                      <TextField
                        name="fatherPhoneNo"
                        id="fatherPhoneNo"
                        placeholder="최대 20자"
                        defaultValue={student.fatherPhoneNo}
                        onChange={(event) => Valid.maxLength(event, 20, '부-핸드폰')}
                        variant="outlined"
                      />                      
                    </TableCell>
                  </TableRow>    
                  <TableRow>
                  <TableCell>
                      <TextField
                        name="motherName"
                        id="motherName"
                        placeholder="최대 15자"
                        onChange={(event) => Valid.maxLength(event, 15, '모-성명(한글)')}
                        defaultValue={student.motherName}
                        variant="outlined"
                      />                      
                    </TableCell>
                  <TableCell>
                      <TextField
                        name="motherNameEng"
                        id="motherNameEng"
                        placeholder="최대 20자"
                        onChange={(event) => Valid.maxLength(event, 20, '모-성명(영문)')}
                        defaultValue={student.motherNameEng}
                        variant="outlined"
                      />                      
                    </TableCell>
                    <TableCell>모</TableCell>
                    <TableCell>
                      <TextField
                        name="motherPhoneNo"
                        id="motherPhoneNo"
                        name="motherPhoneNo"
                        placeholder="최대 20자"
                        onChange={(event) => Valid.maxLength(event, 20, '모-핸드폰')}
                        defaultValue={student.motherPhoneNo}
                        variant="outlined"
                      />                      
                    </TableCell>
                  </TableRow>            
              </TableBody>
            </Table>

            <Table>
            <TableBody>
              <TableRow>
                <TableCell>학급대표여부</TableCell>
                <TableCell colSpan="3">
                  <select
                      className={classes.selectBox1}
                      id="representYn"
                      name="representYn"
                  >                    
                    <CommonCode superCode="YN" selectedValue={student.representYn}/>
                  </select>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>           
          </CardContent>

          <CardHeader title="결제정보" />
          <Divider />
          <CardContent>
            <Table>    
              <TableBody>
                <TableRow>
                  <TableCell>은행</TableCell>
                  <TableCell>
                    <select
                        className={classes.selectBox1}
                        id="bank"
                        name="bank"
                    >                    
                      <CommonCode superCode="BANK_CD" selectedValue={student.bank}/>
                    </select>
                  </TableCell>
                  <TableCell>계좌번호</TableCell>
                  <TableCell>
                      <TextField
                        name="accountNo"
                        id="accountNo"
                        placeholder="최대 20자"
                        onChange={(event) => Valid.maxLength(event, 20, '계좌번호')}
                        defaultValue={student.accountNo}
                        variant="outlined"
                      />                      
                    </TableCell>
                </TableRow>  
                <TableRow>
                  <TableCell>계좌주</TableCell>
                  <TableCell>
                      <TextField
                        name="accountHolder"
                        id="accountHolder"
                        placeholder="최대 30자"
                        onChange={(event) => Valid.maxLength(event, 30, 'accountHolder')}
                        defaultValue={student.accountHolder}
                        variant="outlined"
                      />                      
                    </TableCell>
                  <TableCell>IBAN</TableCell>
                  <TableCell>
                      <TextField
                        name="iban"
                        id="iban"
                        name="iban"
                        placeholder="최대 20자"
                        onChange={(event) => Valid.maxLength(event, 20, 'IBAN')}
                        defaultValue={student.iban}
                        variant="outlined"
                      />                      
                    </TableCell>
                </TableRow>  
                <TableRow>
                  <TableCell>BIC</TableCell>
                  <TableCell colSpan="3">
                      <TextField
                        name="bic"
                        id="bic"
                        placeholder="최대 20자"
                        onChange={(event) => Valid.maxLength(event, 20, 'BIC')}
                        defaultValue={student.bic}
                        variant="outlined"
                      />                      
                    </TableCell>
                </TableRow>         
              </TableBody>
            </Table>
          </CardContent>

          <Divider />
          <CardActions className={classes.actions}>
            <Button 
              color="primary"
              onClick={onClose}
              variant="contained" >
              닫기
            </Button>
            <Button
              color="primary"
              onClick={updateStudentFamily}
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

FamilyEditModal.propTypes = {
  className: PropTypes.string,
  student: PropTypes.any,
  onSaveAndClose: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

FamilyEditModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSaveAndClose: () => {}
};

export default FamilyEditModal;
