import React, { useState } from 'react';
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
  TableCell,
  TextField,
  TableHead
} from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';
import Valid from '../../../../utils/Valid';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  selectBox1 : {
    width: 180,
    display: 'inline-block',
    alignItems: 'left'

  },
  textFiled: {
    width: 220
  }
}));

function FamilyInfo({ className, ...rest }) {
  const classes = useStyles();
  const [students, setStudents] = useState({});

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="학생 가족정보" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
            <TableHead></TableHead>
            <TableBody>
            <TableRow>
              <TableCell>                
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="부-성명(한글)"
                    id="fatherName"
                    name="fatherName"
                    placeholder="최대 15자"
                    onChange={(event) => Valid.maxLength(event, 15, '부-성명(한글)')}
                    variant="outlined"
                  />
              </TableCell>
              <TableCell>                
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="부-성명(영문)"
                    id="fatherNameEng"
                    name="fatherNameEng"
                    placeholder="최대 15자"
                    onChange={(event) => Valid.maxLength(event, 15, '부-성명(영문)')}
                    variant="outlined"
                  />
              </TableCell>

              <TableCell>
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="부-핸드폰"
                    id="fatherPhoneNo"
                    name="fatherPhoneNo"
                    placeholder="최대 20자"
                    onChange={(event) => Valid.maxLength(event, 20, '부-핸드폰')}
                    value={students.name}
                    variant="outlined"
                  />
              </TableCell>

            </TableRow>    
            <TableRow selected>
              <TableCell>                              
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="모-성명(한글)"
                    id="motherName"
                    name="motherName"
                    placeholder="최대 15자"
                    onChange={(event) => Valid.maxLength(event, 15, '모-성명(한글)')}
                    variant="outlined"
                  />
                </TableCell>
              <TableCell>                              
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="모-성명(영문)"
                    id="motherNameEng"
                    name="motherNameEng"
                    placeholder="최대 20자"
                    onChange={(event) => Valid.maxLength(event, 20, '모-성명(영문)')}
                    variant="outlined"
                  />
                </TableCell>

              <TableCell>                          
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="모-핸드폰"
                    id="motherPhoneNo"
                    name="motherPhoneNo"
                    placeholder="최대 20자"
                    onChange={(event) => Valid.maxLength(event, 20, '모-핸드폰')}
                    value={students.name}
                    variant="outlined"
                  />
                </TableCell>
            </TableRow>

            <TableRow>
             <TableCell>                                                  
                <TextField
                    className={classes.selectBox1}
                    fullWidth
                    label="대표여부"
                    margin="dense"
                    id="representYn"
                    name="representYn"
                    select
                    SelectProps={{ native: true }}
                    value={students.greadeOptions}
                    variant="outlined"
                  >                    
                  <CommonCode superCode="YN"/>
                </TextField>
              </TableCell>                
            </TableRow>            
          </TableBody>
        </Table>
      </CardContent>
      <Divider />
      <CardHeader title="결제정보" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>    
          <TableBody>
            <TableRow>
              <TableCell>
                  <TextField
                    className={classes.selectBox1}
                    fullWidth
                    label="은행"
                    margin="dense"
                    id="bank"
                    name="bank"
                    select
                    SelectProps={{ native: true }}
                    value={students.greadeOptions}
                    variant="outlined"
                  >                    
                    <CommonCode superCode="BANK_CD"/>
                  </TextField>
                </TableCell>
              <TableCell>                            
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="계좌번호"
                    id="accountNo"
                    name="accountNo"
                    placeholder="최대 20자"
                    onChange={(event) => Valid.maxLength(event, 20, '계좌번호')}
                    value={students.name}
                    variant="outlined"
                  />
                </TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>                     
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="계좌주"
                    id="accountHolder"
                    name="accountHolder"
                    placeholder="최대 30자"
                    onChange={(event) => Valid.maxLength(event, 30, 'accountHolder')}
                    value={students.name}
                    variant="outlined"
                  />
                </TableCell>

              <TableCell>               
                <TextField
                    className={classes.textFiled}
                    fullWidth
                    label="IBAN"
                    id="iban"
                    name="iban"
                    placeholder="최대 30자"
                    onChange={(event) => Valid.maxLength(event, 30, 'IBAN')}
                    value={students.name}
                    variant="outlined"
                  />
                </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>               
                <TextField
                    fullWidth
                    label="BIC"
                    id="bic"
                    name="bic"
                    placeholder="최대 20자"
                    onChange={(event) => Valid.maxLength(event, 20, 'BIC')}
                    value={students.name}
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

FamilyInfo.propTypes = {
  className: PropTypes.string
};

export default FamilyInfo;
