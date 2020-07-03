import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BasicInfo from './BasicInfo';
import FamilyInfo from './FamilyInfo';
import ClassInfo from './ClassInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function BasicAndFamilyInfo({ sid, className, ...rest }) {
  const classes = useStyles();
  const [student, setStudent] = useState();

  const callApi = async (query) => {
    const url = '/api/paradox/list?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }

  useEffect(() => {
    let mounted = true;
  
    const viewBasicInfo = () => {
      let query = 'sid=' + sid;
      callApi(query)
      .then(response => {
        if (mounted) {
          console.log(response.results[0])
          setStudent(response.results[0]);
        }
      })
      .catch(err => console.log(err));
    }; //searchOnlyClassNo

    viewBasicInfo();

    return () => {
      mounted = false;
    };
  }, []);

  if (!student) {
    return null;
  }

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
        xl={3}
        xs={12}
      >
        <BasicInfo student={student} />
      </Grid>
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <FamilyInfo student={student} />
      </Grid>
      <Grid
        item
        lg={4}
        md={6}
        xl={4}
        xs={12}
      >
        <ClassInfo student={student} />
      </Grid>

    </Grid>
  );
}

BasicAndFamilyInfo.propTypes = {
  className: PropTypes.string
};

export default BasicAndFamilyInfo;
