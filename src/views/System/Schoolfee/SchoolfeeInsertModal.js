import React from 'react';
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
import CommonCode from '../../../utils/CommonCode';
import DataExtract from '../../../utils/DataExtract';
import Valid from '../../../utils/Valid';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1300,
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
}));

/**
 * 사용자 추가 모달 팝업
 * @param {*} param0 
 * @param newUserId 사용자 추가할 때의 슈퍼코드의 ID
 * @param newUserName 사용자 추가할 때의 슈퍼코드의 이름
 * @param search 사용자 추가 후 부모창의 목록 재조회
 */
function UserInsertModal({ open, search, onClose, className, ...rest }) {
  const classes = useStyles(); 

 /**
  * 사용자 신규 저장
  */ 
  const save = () => { 
    let form = document.forms['form'];  
    const formData = new FormData();
    if(!DataExtract.getSelectedValue(form.applyYear)) {
        alert('적용연도를 입력하지 않았습니다.');
        return;
    };  
    if(!DataExtract.getSelectedValue(form.applyStartMonth)) {
        alert('적용시작월 입력하지 않았습니다.');
        return;
    };  
    if(!DataExtract.getSelectedValue(form.applyEndMonth)) {
        alert('적용종료월을 입력하지 않았습니다.');
        return;
    };  
    let applyMonths = DataExtract.applyMonths(DataExtract.getSelectedValue(form.applyYear), DataExtract.getSelectedValue(form.applyStartMonth), DataExtract.getSelectedValue(form.applyEndMonth));
 
    formData.append('applyMonths', applyMonths); 

    //수업료
    formData.append('regularSchoolFee', `${form.regularSchoolfeeEuro.value}.${form.regularSchoolfeeCent.value}`);  
    formData.append('extraSchoolFee1', `${form.extraSchoolfee1Euro.value}.${form.extraSchoolfee1Cent.value}`);  
    formData.append('extraSchoolFee2', `${form.extraSchoolfee2Euro.value}.${form.extraSchoolfee2Cent.value}`);  
    formData.append('regularSchoolFeeDiscount', `${form.regularSchoolfeeDiscountEuro.value}.${form.regularSchoolfeeDiscountCent.value}`);  
    formData.append('extraSchoolFee1Discount', `${form.extraSchoolfee1DiscountEuro.value}.${form.extraSchoolfee1DiscountCent.value}`);  
    formData.append('extraSchoolFee2Discount', `${form.extraSchoolfee2DiscountEuro.value}.${form.extraSchoolfee2DiscountCent.value}`);  
    //수업료
    formData.append('creId', 'root');    

    const url = '/api/schoolfee/save';
    const config = {
          headers : { 'content-type' : 'multipart/form-data' },
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
 }//updateStudentBasicInfo


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
          <CardHeader title="수업료 신규 적용기간" />
          <Divider />
          <CardContent>
            <Table>              
              <TableHead>
                <TableRow>
                  <TableCell>적용연도</TableCell>
                  <TableCell>적용시작월</TableCell>
                  <TableCell>적용종료월</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <select id="applyYear" name="applyYear" className={classes.selectBox}>
                     <CommonCode superCode="SEMESTER_YEAR" firstSelectYn="N" />
                    </select>
                  </TableCell>
                  <TableCell>
                    <select id="applyStartMonth" name="applyStartMonth" className={classes.selectBox}>
                     <CommonCode superCode="MONTH" firstSelectYn="N" />
                    </select>
                  </TableCell>
                  <TableCell>
                    <select id="applyEndMonth" name="applyEndMonth" className={classes.selectBox}>
                     <CommonCode superCode="MONTH" firstSelectYn="N" />
                    </select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          <Divider />            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan="2" align="center">수업유형별 수업료</TableCell>
                  <TableCell colSpan="2" align="center">수업유형별 할인 수업료</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>정규수업 수업료</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="regularSchoolfeeEuro"
                      id="regularSchoolfeeEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '정규수업 수업료')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="regularSchoolfeeCent"
                      id="regularSchoolfeeCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정규수업 수업료')}
                      className={classes.curreuncy2}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>정규수업 수업료 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="regularSchoolfeeDiscountEuro"
                      id="regularSchoolfeeDiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '정규수업 수업료 할인')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="regularSchoolfeeDiscountCent"
                      id="regularSchoolfeeDiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '정규수업 수업료 할인')}
                      className={classes.curreuncy2}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료1</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="extraSchoolfee1Euro"
                      id="extraSchoolfee1Euro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료1 수업료')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="extraSchoolfee1Cent"
                      id="extraSchoolfee1Cent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료1 수업료')}
                      className={classes.curreuncy2}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료1 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="extraSchoolfee1DiscountEuro"
                      id="extraSchoolfee1DiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료1  할인')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="extraSchoolfee1DiscountCent"
                      id="extraSchoolfee1DiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료1  할인')}
                      className={classes.curreuncy2}
                    />
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료2</TableCell>
                  <TableCell className={classes.schoolfee}>                    
                    <TextField
                      name="extraSchoolfee2Euro"
                      id="extraSchoolfee2Euro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료2 수업료')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="extraSchoolfee2Cent"
                      id="extraSchoolfee2Cent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료2 수업료')}
                      className={classes.curreuncy2}
                    />
                  </TableCell>
                  <TableCell className={classes.schoolfeeTitle}>비정규수업 수업료2 할인</TableCell>
                  <TableCell className={classes.schoolfee}>  
                    <TextField
                      name="extraSchoolfee2DiscountEuro"
                      id="extraSchoolfee2DiscountEuro"
                      variant="outlined"
                      placeholder="Euro"
                      onChange={(event) => Valid.onlyNumber(event, 3, '비정규수업 수업료2  할인')}
                      className={classes.curreuncy1}
                    />
                    <span align="center" className={classes.point}>,</span>
                    <TextField
                      name="extraSchoolfee2DiscountCent"
                      id="extraSchoolfee2DiscountCent"
                      variant="outlined"
                      placeholder="Cent"
                      onChange={(event) => Valid.onlyNumber(event, 2, '비정규수업 수업료2  할인')}
                      className={classes.curreuncy2}
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
              onClick={save}
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

UserInsertModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };
  
  UserInsertModal.defaultProps = {
    open: false,
    onClose: () => {},
  };  

export default UserInsertModal;
