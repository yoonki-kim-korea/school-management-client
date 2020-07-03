import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FamilyEditModal from './FamilyEditModal';

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
  }
}));

function FamilyInfo({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [student, setStudent] = useState();

  const callApi = async (query) => {
    const url = '/api/oldstudent/view/family?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  const handleEditClose = () => {
    setOpenEdit(false);  
  }

  const handleEditSaveAndClose = (newStudent) => {
    setOpenEdit(false);
    setStudent(newStudent);    
  }
  
  useEffect(() => {
    let mounted = true;
  
    const viewFamlyInfo = () => {
      let query = 'studentId=' + studentId;
      callApi(query)
      .then(response => {
        if (mounted) {
          setStudent(response.familyInfo);
        }
      })
      .catch(err => console.log(err));
    }; //viewFamlyInfo

    viewFamlyInfo();

    return () => {
      mounted = false;
    };
  }, []);

  if (!student) {
    return null;
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >      
      <CardHeader title="가족정보"/>
      <Divider />
      <CardContent className={classes.content}>
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
                <TableCell>{student.fatherName}</TableCell>
                <TableCell>{student.fatherNameEng}</TableCell>
                <TableCell>부</TableCell>
                <TableCell>{student.fatherPhoneNo}</TableCell>
              </TableRow>    
              <TableRow>
                <TableCell>{student.motherName}</TableCell>
                <TableCell>{student.motherNameEng}</TableCell>
                <TableCell>모</TableCell>
                <TableCell>{student.motherPhoneNo}</TableCell>
              </TableRow>            
          </TableBody>
        </Table>
      </CardContent>
      <Divider />

      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>학급대표여부</TableCell>
              <TableCell>{student.representYn}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
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
              <TableCell>은행</TableCell>
              <TableCell>{student.bankStr}</TableCell>
              <TableCell>계좌번호</TableCell>
              <TableCell>{student.accountNo}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>계좌주</TableCell>
              <TableCell>{student.accountHolder}</TableCell>
              <TableCell>IBAN</TableCell>
              <TableCell>{student.iban}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>BIC</TableCell>
              <TableCell>{student.bic}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>         
          </TableBody>
        </Table>
      </CardContent>
      {/**
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          가족정보 수정
        </Button>
      </CardActions> */}
      <FamilyEditModal
        student={student}
        onSaveAndClose={handleEditSaveAndClose}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
}

FamilyInfo.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default FamilyInfo;
