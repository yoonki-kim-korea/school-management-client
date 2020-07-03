import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableRow,
  TextField,
  TableCell
} from '@material-ui/core';
import StudentNo     from '../../../../utils/StudentNo';
import CommonCode  from '../../../../utils/CommonCode';
import DataExtract from '../../../../utils/DataExtract';
import Valid from '../../../../utils/Valid';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  dateField: {
    '& + &': {
      width: 180,
      marginLeft: theme.spacing(2)
    }
  },
  selectBox1 : {
    width: 180,
    display: 'inline-block',
    alignItems: 'left'

  },
  textFiled: {
    width: 220
  },
  dateField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


/**
 * 학생기본정보 입력탭
 * @param {*} param0 
 */
function BasicInfo({ className, ...rest }) {
  const classes = useStyles();

  /**
   * 연도, 최초 입학부서에 따른 유효한 학번일련번호를 조회한다.
   */
  const studentNoValidCheck = () => {
    let form = document.forms['form'];  
    let year = DataExtract.getSelectedValue(form.studentNoYear, '');
    let dpt = DataExtract.getSelectedValue(form.studentNoDpt,'');
    let studentNo =  year + dpt;

    if(studentNo && studentNo.length === 3){
      StudentNo.selectValidSeqList(year, dpt, "studentNoSeq");
    }    
  }//studentNoValidCheck

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title="학생 상세정보" />
        <Divider />
        <CardContent className={classes.content}>
          <Table>
            <TableBody>
              <TableRow selected>
                <TableCell colSpan="2">                     
                  <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="학번-연도"
                      margin="dense"
                      name="studentNoYear"
                      onChange={studentNoValidCheck}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                      <CommonCode superCode="CLASS_NO_YY"/>
                    </TextField>
                    <span>-</span>                                 
                    <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="학번-최초 입학 부서"
                      margin="dense"
                      name="studentNoDpt"
                      onChange={studentNoValidCheck}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                      <CommonCode superCode="DEPARTMENT"/>
                    </TextField>
                    <span>-</span>  
                    <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="학번-일련번호"
                      margin="dense"
                      id="studentNoSeq"
                      name="studentNoSeq"
                      required={true}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="한글성명"
                    name="koreanName"
                    id="koreanName"
                    placeholder="최대 15자"
                    onChange={(event) => Valid.maxLength(event, 15, '한글성명')}
                    variant="outlined"
                    required={true}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="독어성명"
                    name="germanName"
                    placeholder="최대 30자"
                    onChange={(event) => Valid.maxLength(event, 30, '독어성명')}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow selected>              
                <TableCell>  
                  <TextField
                    id="birthday"
                    name="birthday"
                    label="생년월일"
                    type="date"
                    defaultValue=""
                    className={classes.dateField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>           
                <TableCell>    
                  <TextField
                    id="entranceDay"
                    name="entranceDay"
                    label="입학일"
                    type="date"
                    defaultValue=""
                    className={classes.dateField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>                  
                  <TextField
                    className={classes.selectBox1}
                    fullWidth
                    label="출생지"
                    margin="dense"
                    name="birthPlace"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >                    
                    <CommonCode superCode="BIRTH_PLACE_CD"/>
                  </TextField>
                </TableCell>
                <TableCell>                                    
                  <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="성별"
                      margin="dense"
                      name="gender"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                    <CommonCode superCode="GENDER"/>
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell>
                  <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="E-Mail"
                    name="email"
                    placeholder="최대 40자"
                    onChange={(event) => Valid.maxLength(event, 45, 'E-Mail')}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="핸드폰"
                    name="mobileNo"
                    placeholder="최대 45자"
                    onChange={(event) => Valid.maxLength(event, 45, '핸드폰')}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="PLZ"
                    name="plz"
                    placeholder="최대 5자"
                    onChange={(event) => Valid.maxLength(event, 5, 'PLZ')}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    label="주소(도시)"
                    name="addressCity"
                    placeholder="최대 50자"
                    onChange={(event) => Valid.maxLength(event, 50, '주소(도시)')}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="주소(상세)"
                    name="addressDtl"
                    placeholder="최대 50자"
                    onChange={(event) => Valid.maxLength(event, 50, '주소(상세)')}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
    </Card>
  );
}

BasicInfo.propTypes = {
  className: PropTypes.string
};

export default BasicInfo;
