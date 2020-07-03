import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button } from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {},
  topBtn:{
    marginLeft:10
  }
}));

/**
 * 학급관리 > 종료학급관리의 상세보기
 * @param {*} param0 
 */
function Header({ classId, classType, search, className, ...rest }) {
  const classes = useStyles();

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
            종료 학급 관리
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
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
