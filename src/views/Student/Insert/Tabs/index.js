import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BasicInfo from './BasicInfo';
import FamilyInfo from './FamilyInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Summary({ className, ...rest }) {
  const classes = useStyles();

  return (
    <form id="form">
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={2}
    >     
        <Grid
          item
          lg={4}
          md={6}
          xl={6}
          xs={12}
        >
          <BasicInfo   />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={6}
          xs={12}
        >
          <FamilyInfo  />
        </Grid>
    </Grid>
      </form>
  );
}

Summary.propTypes = {
  className: PropTypes.string
};

export default Summary;
