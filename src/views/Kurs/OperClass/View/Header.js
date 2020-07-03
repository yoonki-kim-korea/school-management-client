import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import InsertStudentModal from './modals/InsertStudentModal';

const useStyles = makeStyles(() => ({
  root: {},
  topBtn:{
    marginLeft:10
  }
}));

/**
 * 운영학급관리 > 학생 재배정 및 관리
 * @param {*} param0 
 */
function Header({ classId, classType, search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false); 

  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  const handleEditClose = () => {
    setOpenEdit(false); 
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            학급 관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            학생 재배정 및 관리
          </Typography>
        </Grid>

        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={()=>{window.history.back();}}
          >
            뒤로
          </Button>  
          <Button
            color="primary"
            variant="contained"
            className={classes.topBtn}
            onClick={handleEditOpen}
          >
            학생 전입
          </Button>     

          {/**학생 전입 모달 */}     
          <InsertStudentModal
              search={search}
              classId={classId}
              classType={classType}
              onClose={handleEditClose}
              open={openEdit}
            />
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
