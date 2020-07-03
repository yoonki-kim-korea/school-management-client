import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BasicInfo from './BasicInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Summary({ className, ...rest }) {
  const classes = useStyles();

  useEffect(() => {
    let mounted = true;

    const fetchTeacher = () => {      
    }

    fetchTeacher();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <form id="teacher">
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
            xl={10}
            xs={12}
          >
            <BasicInfo   />
          </Grid>
        
        </Grid>
      </form>
  );
}

Summary.propTypes = {
  className: PropTypes.string
};

export default Summary;
