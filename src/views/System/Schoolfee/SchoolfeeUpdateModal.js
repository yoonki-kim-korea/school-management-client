import React  from 'react';
import {post} from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Proxy       from '../../../utils/Proxy';
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
import DataExtract from '../../../utils/DataExtract';
import Valid from '../../../utils/Valid';
import SpecialCommonCode from '../../../utils/SpecialCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1200,
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
  schoolfeeTitle:{
    //width:'18%'
  },
  schoolfee:{
    display: 'flex', //'inline-flex',
    //width:'32%'
  },
  curreuncy1:{
    width:80,
  },
  curreuncy2:{
    width:60
  },
  point: {
    verticalAlign:'bottom',
    marginTop:'25px'
  },
}));

/**
 * 수업료 수정 모달 팝업
 * @param {*} param0 
 */
function UserUpdateModal({ open, onClose, editable, search, className, ...rest }) {
  const classes = useStyles(); 
  
 /**
  * 수업료 수정 저장
  */ 
  const update = () => {
    let form = document.forms['form'];  
    const url = '/api/schoolfee/update';
    const formData = new FormData(); 
    formData.append('regularSchoolFee', `${form.regularSchoolFeeEuro.value}.${form.regularSchoolFeeCent.value}`);  
    formData.append('extraSchoolFee1', `${form.extraSchoolFee1Euro.value}.${form.extraSchoolFee1Cent.value}`);  
    formData.append('extraSchoolFee2', `${form.extraSchoolFee2Euro.value}.${form.extraSchoolFee2Cent.value}`);  
    formData.append('regularSchoolFeeDiscount', `${form.regularSchoolFeeDiscountEuro.value}.${form.regularSchoolFeeDiscountCent.value}`);  
    formData.append('extraSchoolFee1Discount', `${form.extraSchoolFee1DiscountEuro.value}.${form.extraSchoolFee1DiscountCent.value}`);  
    formData.append('extraSchoolFee2Discount', `${form.extraSchoolFee2DiscountEuro.value}.${form.extraSchoolFee2DiscountCent.value}`);  
    formData.append('applyYear', editable.applyYear);  
    formData.append('applyMonth', editable.applyMonth);  
    formData.append('paymentChageYn', editable.paymentCount > 0 ? "Y": "N");  
    formData.append('applySemesterId', DataExtract.getSelectedValue(document.getElementById('applySemesterId')));  
    formData.append('udtId', 'root');  
    
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
 }//update

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
          <CardHeader title={editable.applyYear + '년 ' +  editable.applyMonthName + '  수업료 수정'} />
          <Divider />
          <CardContent>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan="2" align="center">적용학기</TableCell>
                  <TableCell colSpan="2" align="center">
                    
                    <select className={classes.selectBox}                          
                          id="applySemesterId"  name="applySemesterId"
                    >       
                      <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="Y" selectedValue={editable.semesterId}/>                
                    </select>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan="2" align="center">수업유형별 수업료</TableCell>
                  <TableCell colSpan="2" align="center">수업유형별 할인 수업료</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>정규수업 수업료</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="regularSchoolFeeEuro"
                      id="regularSchoolFeeEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '정규수업 수업료')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.regularSchoolFee)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="regularSchoolFeeCent"
                      id="regularSchoolFeeCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정규수업 수업료')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.regularSchoolFee)}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>정규수업 수업료 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="regularSchoolFeeDiscountEuro"
                      id="regularSchoolFeeDiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '정규수업 수업료 할인')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.regularSchoolFeeDiscount)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="regularSchoolFeeDiscountCent"
                      id="regularSchoolFeeDiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정규수업 수업료 할인')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.regularSchoolFeeDiscount)}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료1</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="extraSchoolFee1Euro"
                      id="extraSchoolFee1Euro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료1 수업료')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.extraSchoolFee1)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="extraSchoolFee1Cent"
                      id="extraSchoolFee1Cent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료1 수업료')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.extraSchoolFee1)}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료1 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="extraSchoolFee1DiscountEuro"
                      id="extraSchoolFee1DiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료1  할인')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.extraSchoolFee1Discount)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="extraSchoolFee1DiscountCent"
                      id="extraSchoolFee1DiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료1  할인')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.extraSchoolFee1Discount)}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료2</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="extraSchoolFee2Euro"
                      id="extraSchoolFee2Euro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료2 수업료')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.extraSchoolFee2)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="extraSchoolFee2Cent"
                      id="extraSchoolFee2Cent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료2 수업료')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.extraSchoolFee2)}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료2 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="extraSchoolFee2DiscountEuro"
                      id="extraSchoolFee2DiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료2  할인')}
                      className={classes.curreuncy1}
                      defaultValue={DataExtract.Euro(editable.extraSchoolFee2Discount)}
                    />
                    <h1 align="center" className={classes.point}>,</h1>
                    <TextField
                      name="extraSchoolFee2DiscountCent"
                      id="extraSchoolFee2DiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료2  할인')}
                      className={classes.curreuncy2}
                      defaultValue={DataExtract.Cent(editable.extraSchoolFee2Discount)}
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
              variant="contained"
              onClick={onClose}>
              닫기
            </Button>
            <Button
              color="primary"
              onClick={() => update()}
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

UserUpdateModal.propTypes = {
    className: PropTypes.string,
    superCode: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UserUpdateModal.defaultProps = {
    open: false,
    onClose: () => {},
  };  

export default UserUpdateModal;
