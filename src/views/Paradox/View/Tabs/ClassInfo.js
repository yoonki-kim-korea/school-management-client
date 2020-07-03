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

function ClassInfo({ student, className, ...rest }) {
  const classes = useStyles();
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="학급"/>
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>오전</TableCell>
              <TableCell>오후</TableCell>
            </TableRow>            
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>학년</TableCell>
              <TableCell>{student.klasse1}</TableCell>
              <TableCell>{student.klasse2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>입학일</TableCell>
              <TableCell>{student.eintrittdat1}</TableCell>
              <TableCell>{student.eintrittdat2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>수업료계산</TableCell>
              <TableCell>{student.immadat1}</TableCell>
              <TableCell>{student.immadat2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>수업료</TableCell>
              <TableCell>{student.monatbeitrag1}</TableCell>
              <TableCell>{student.monatbeitrag2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>퇴학일</TableCell>
              <TableCell>{student.exmadatum1}</TableCell>
              <TableCell>{student.exmadatum2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>퇴학사유</TableCell>
              <TableCell>{student.exmart1}</TableCell>
              <TableCell>{student.exmart2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>지불방법</TableCell>
              <TableCell colSpan="2">{student.zahlart}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>수업료 감면사유</TableCell>
              <TableCell colSpan="2">{student.beitragsfrei}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>    
    </Card>
  );
}

ClassInfo.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default ClassInfo;
