import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import {post} from 'axios';
import ExcelInfo     from '../../../utils/ExcelInfo';

const useStyles = makeStyles(() => ({
  root: {},
  
  topbtn:{
    display:'inline-block', 
    marginLeft: '10px'
  },
}));

function Header({ search, className, ...rest }) {
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
            학생관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            Paradox 학생정보
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
