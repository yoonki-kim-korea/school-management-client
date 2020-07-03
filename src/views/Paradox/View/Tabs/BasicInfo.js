import React, { useState, useEffect }  from 'react';
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

function BasicInfo({ student, className, ...rest }) {
  console.log('------------------------------------- ', student)
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  const handleEditClose = () => {
    setOpenEdit(false); 
  }

  const handleEditSaveAndClose = (newStudent) => {
    setOpenEdit(false);
    //setStudent(newStudent);    
  }


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

            <TableRow>
              <TableCell>학번</TableCell>
              <TableCell>{student.snr}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>한글성명</TableCell>
              <TableCell>{student.koreanname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>독어성명</TableCell>
              <TableCell>{student.vorname + ' ' + student.lastname}</TableCell>
            </TableRow>
            <TableRow>              
              <TableCell>생년월일</TableCell>
              <TableCell>{student.geboren}</TableCell>
            </TableRow>
            <TableRow>              
              <TableCell>분류</TableCell>
              <TableCell>{student.kurzlang}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>성별</TableCell>
              <TableCell>{student.gender}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>출생지</TableCell>
              <TableCell>{student.geborenin}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>E-Mail</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PLZ</TableCell>
              <TableCell>{student.plz}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>주소</TableCell>
              <TableCell>{student.strasse}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ort</TableCell>
              <TableCell>{student.ort}</TableCell>
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
      </CardActions>
      <BasicInfoEditModal
        student={student}
        onSaveAndClose={handleEditSaveAndClose}
        onClose={handleEditClose}
        open={openEdit}
      />*/}
    </Card>
  );
}

BasicInfo.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default BasicInfo;
