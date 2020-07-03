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

function FamilyInfo({ student, className, ...rest }) {
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
      <CardHeader title="학부모"/>
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableRow>
            <TableCell>부(영문)</TableCell>
            <TableCell>{student.vater}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>모(영문)</TableCell>
            <TableCell>{student.fatherPhonmuttereNo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>직업</TableCell>
            <TableCell>[{student.firmanr}] {student.hfirma}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>전화</TableCell>
            <TableCell>{student.telefon}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>긴급전화</TableCell>
            <TableCell>{student.notruf}</TableCell>
          </TableRow>
            <TableRow>
              <TableCell>학급대표여부</TableCell>
              <TableCell>{student.ebeirat}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>은행</TableCell>
              <TableCell>{student.bank}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>계좌번호</TableCell>
              <TableCell>{student.kontonr}</TableCell>
            </TableRow>   
            <TableRow>
              <TableCell>은행번호</TableCell>
              <TableCell>{student.blz}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>구좌인</TableCell>
              <TableCell>{student.bankinh}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>IBAN</TableCell>
              <TableCell>{student.iban}</TableCell>
            </TableRow>  
            <TableRow>
              <TableCell>BIC</TableCell>
              <TableCell>{student.bic}</TableCell>
            </TableRow>
          
        </Table>
      </CardContent>


      {/**
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          가족정보 수정
        </Button>
      </CardActions>
      <FamilyEditModal
        student={student}
        onSaveAndClose={handleEditSaveAndClose}
        onClose={handleEditClose}
        open={openEdit}
      /> */}
    </Card>
  );
}

FamilyInfo.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default FamilyInfo;
