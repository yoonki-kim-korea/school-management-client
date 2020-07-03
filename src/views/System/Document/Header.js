import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button } from '@material-ui/core';

import InsertModal from './InsertModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Header({ className, search, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  const handleEditClose = () => {
    setOpenEdit(false); 
  }

  const handleEditSaveAndClose = () => {
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
            시스템 관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            문서 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            항목 추가
          </Button>          
          <InsertModal
              onClose={handleEditClose}
              open={openEdit}
              search={search}
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
