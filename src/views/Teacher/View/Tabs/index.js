import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BasicInfo from './BasicInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function BasicAndFamilyInfo({ teacherId, className, ...rest }) {
  const classes = useStyles();
  
  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid
        item
        lg={4}
        md={6}
        xl={9}
        
        xs={12}
      >
        <BasicInfo teacherId={teacherId} />
      </Grid>

    </Grid>
  );
}

BasicAndFamilyInfo.propTypes = {
  className: PropTypes.string
};

export default BasicAndFamilyInfo;
