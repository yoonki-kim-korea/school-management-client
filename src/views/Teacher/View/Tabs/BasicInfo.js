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
  },
  cellTitle:{
    background: '#E6E6FA',
    border:1, borderStyle:'solid'
  },
  cell:{
    border:1, borderStyle:'solid'
  }
}));

function BasicInfo({ teacherId, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [teacher, setTeacher] = useState();

  const callApi = async (query) => {
    const url = '/api/teacher/view/basic?' + query;
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
    setTeacher(newStudent);    
  }

  useEffect(() => {
    let mounted = true;
  
    const viewBasicInfo = () => {
      let query = 'teacherId=' + teacherId;
      callApi(query)
      .then(response => {
        if (mounted) {
          setTeacher(response.basicInfo);
        }
      })
      .catch(err => console.log(err));
    }; //searchOnlyClassNo

    viewBasicInfo();

    return () => {
      mounted = false;
    };
  }, []);

  if (!teacher) {
    return null;
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="교직원 기본정보" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>

            <TableRow selected>
              <TableCell className={classes.cellTitle} style={{width:200}}>교직원 번호</TableCell>
              <TableCell className={classes.cell} style={{width:200}}>{teacher.teacherNo}</TableCell>
              <TableCell className={classes.cellTitle} style={{width:200}}>성명</TableCell>
              <TableCell className={classes.cell} style={{width:200}}>{teacher.teacherName}</TableCell>
              <TableCell className={classes.cellTitle} style={{width:200}}>영문명</TableCell>
              <TableCell className={classes.cell} style={{width:200}}>{teacher.teacherEngName}</TableCell>
              <TableCell className={classes.cellTitle} style={{width:200}}>성별</TableCell>
              <TableCell className={classes.cell} style={{width:200}}>{teacher.genderStr}</TableCell>
            </TableRow>

            <TableRow >  
              <TableCell className={classes.cellTitle} style={{width:200}}>생년월일</TableCell>
              <TableCell className={classes.cell} style={{width:200}}>{DataExtract.getFommatedDate(teacher.birthday, '-')}</TableCell>
              <TableCell className={classes.cellTitle}>재직상태</TableCell>
              <TableCell className={classes.cell}>{teacher.workStatusStr}</TableCell>
              <TableCell className={classes.cellTitle}>임용일자</TableCell>
              <TableCell className={classes.cell}>{DataExtract.getFommatedDate(teacher.joinDay, '-')}</TableCell>
              <TableCell className={classes.cellTitle}>퇴직일자</TableCell>
              <TableCell className={classes.cell}>{DataExtract.getFommatedDate(teacher.resignDay, '-')}</TableCell>
            </TableRow>

            <TableRow selected>
              <TableCell className={classes.cellTitle}>E-Mail</TableCell>
              <TableCell className={classes.cell}>{teacher.email}</TableCell>
              <TableCell className={classes.cellTitle}>전화번호</TableCell>
              <TableCell className={classes.cell}>{teacher.mobileNo}</TableCell>
              <TableCell className={classes.cellTitle}>직무</TableCell>
              <TableCell className={classes.cell}>{teacher.dutyName}</TableCell>
              <TableCell className={classes.cellTitle}> </TableCell>
              <TableCell className={classes.cell}> </TableCell>
            </TableRow>

            <TableRow >
              <TableCell className={classes.cellTitle}>PLZ</TableCell>
              <TableCell className={classes.cell}>{teacher.plz}</TableCell>
              <TableCell className={classes.cellTitle}>주소</TableCell>
              <TableCell colSpan="5" className={classes.cell}>{teacher.addressDtl}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          교직원 기본정보 수정
        </Button>
      </CardActions>
      <BasicInfoEditModal
        teacher={teacher}
        onSaveAndClose={handleEditSaveAndClose}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
}

BasicInfo.propTypes = {
  className: PropTypes.string,
  teacher: PropTypes.object.isRequired
};

export default BasicInfo;
