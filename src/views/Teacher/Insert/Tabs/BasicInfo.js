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
import TeacherNo     from '../../../../utils/TeacherNo';
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
    width : 200
  }
}));

function BasicInfo({ className, ...rest }) {
  const classes = useStyles();

  /**
   * 연도, 최초 입학부서에 따른 유효한 학번일련번호를 조회한다.
   */
  const teacherNoValidCheck = () => {
    let teacher = document.forms['teacher'];  
    let year = DataExtract.getSelectedValue(teacher.teacherNoYear, '');
    let teacherNo =  year;

    if(teacherNo && teacherNo.length === 2){
      TeacherNo.selectValidSeqList(year, "teacherNoSeq");
    }    
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title="교직원 상세정보" />
        <Divider />
        <CardContent className={classes.content}>
          <Table>
            <TableBody>
              <TableRow selected>
                <TableCell>                                 
                  <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="입사연도"
                      margin="dense"
                      id="teacherNoYear"
                      name="teacherNoYear"
                      onChange={teacherNoValidCheck}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                      <CommonCode superCode="CLASS_NO_YY"/>
                    </TextField>
                </TableCell> 
                <TableCell>                                
                    <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="일련번호"
                      margin="dense"
                      id="teacherNoSeq"
                      name="teacherNoSeq"
                      required={true}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    label="성명"
                    name="teacherName"
                    id="teacherName"
                    onChange={(event) => Valid.maxLength(event, 15, '성명')}
                    variant="outlined"
                    required={true}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>                                    
                  <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="근무상태"
                      margin="dense"
                      name="workStatus"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                    <CommonCode superCode="WORK_STATUS"/>
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
                <TableCell>
                  <TextField
                    fullWidth
                    label="영문명"
                    name="teacherEngName"
                    id="teacherEngName"
                    onChange={(event) => Valid.maxLength(event, 20, '영문명')}
                    variant="outlined"
                    required={true}
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
                    id="joinDay"
                    name="joinDay"
                    label="임용일자"
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
                    id="resignDay"
                    name="resignDay"
                    label="퇴사일자"
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
                    fullWidth
                    label="전화번호"
                    name="mobileNo"
                    placeholder="최대 45자"
                    onChange={(event) => Valid.maxLength(event, 45, '전화번호')}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      className={classes.selectBox1}
                      fullWidth
                      label="직무"
                      margin="dense"
                      name="duty"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >                    
                    <CommonCode superCode="DUTY"/>
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell>
                  <TextField
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
                </TableCell>
                <TableCell>
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
