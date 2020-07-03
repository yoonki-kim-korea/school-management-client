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
  TableCell
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import BasicInfoEditModal from './BasicInfoEditModal';
import DataExtract from '../../../../utils/DataExtract';

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

function BasicInfo({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [student, setStudent] = useState();

  const callApi = async (query) => {
    const url = '/api/oldstudent/view/basic?' + query;
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
  
    const viewBasicInfo = () => {
      let query = 'studentId=' + studentId;
      callApi(query)
      .then(response => {
        if (mounted) {
          setStudent(response.basicInfo);
        }
      })
      .catch(err => console.log(err));
    }; //searchOnlyClassNo

    viewBasicInfo();

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
      {student.studentStatus === 'LEV' ? <CardHeader title="휴학생 상세정보" /> : <CardHeader title="졸업생 상세정보" />}
      
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow selected>
              <TableCell>SYSTEM ID</TableCell>
              <TableCell>{student.studentId}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>학번</TableCell>
              <TableCell>{student.studentNo}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>한글성명</TableCell>
              <TableCell>{student.koreanName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>독어성명</TableCell>
              <TableCell>{student.germanName}</TableCell>
            </TableRow>
            <TableRow selected>              
              <TableCell>생년월일</TableCell>
              <TableCell>{DataExtract.getFommatedDate(student.birthday, '-')}</TableCell>
            </TableRow>
            
            <TableRow>              
              <TableCell>입학일</TableCell>
              <TableCell>{DataExtract.getFommatedDate(student.entranceDay, '-')}</TableCell>
            </TableRow>
            
            <TableRow selected>              
              <TableCell>{student.studentStatus === 'LEV' ? '휴학일' : '졸업일'}</TableCell>
              <TableCell>{student.studentStatus === 'LEV' ? DataExtract.getFommatedDate(student.levDay, '-') : DataExtract.getFommatedDate(student.graduateDay, '-')}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>성별</TableCell>
              <TableCell>{student.genderStr}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>출생지</TableCell>
              <TableCell>{student.birthPlaceStr}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>E-Mail</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>핸드폰</TableCell>
              <TableCell>{student.mobileNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PLZ</TableCell>
              <TableCell>{student.plz}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>주소</TableCell>
              <TableCell>{student.addressCity} {student.addressDtl}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      {/**
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          학생 기본정보 수정
        </Button>
      </CardActions> */}
      <BasicInfoEditModal
        student={student}
        onSaveAndClose={handleEditSaveAndClose}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
}

BasicInfo.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default BasicInfo;
