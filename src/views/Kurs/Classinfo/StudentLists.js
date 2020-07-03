import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Paper,
  List
} from '@material-ui/core';
import LeftCandidateTable from './AssignStudents/LeftCandidateTable';
import RightAssigendTable from './AssignStudents/RightAssigendTable';

const useStyles = makeStyles((theme) => ({
  root: {},
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

/**
 * 배정후보학생 중 선택하여 배정버튼을 클릭했을 때 오른쪽 테이블로 이동시킨다.
 * @param {*}} param0 
 */
function StudentLists({ candidates, allAsignedStudents, className, ...rest }) {
  const classes = useStyles();

  /**
   * 좌측 테이블에서 선택된 배정후보학생들을 오른쪽 테이블로 이동시킨다.
   * @param {*} selectedStudents 
   */
  const assignStudents = (selectedStudents) => {

    if(allAsignedStudents == null || allAsignedStudents.length == 0) {
      allAsignedStudents = selectedStudents;
    }else{
      allAsignedStudents = [...allAsignedStudents, ...selectedStudents ];
    }

    ReactDOM.render(<RightAssigendTable  selectedStudents={allAsignedStudents}/>, document.getElementById("secondTable"));
  }//assignStudents

  return (
    <>   
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        lg={4}
        xs={'auto'}
      >
        <LeftCandidateTable candidates={candidates} assignStudents={assignStudents}/>
      </Grid>
 
      {/****************************************************** */}
      <Grid
        item
        lg={4}
        xs={12}
      >
        <Paper
          {...rest}
          className={clsx(classes.root, className)}
        >
          <List id="secondTable" dense disablePadding>
          </List>
        </Paper>
      </Grid>
      
      {/****************************************************** */}
    </Grid>
    </>
  );
}

StudentLists.propTypes = {
  className: PropTypes.string
};

export default StudentLists;
