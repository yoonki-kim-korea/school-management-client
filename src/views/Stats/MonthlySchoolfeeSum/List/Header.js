import React,  {useState} from 'react';
import PropTypes from 'prop-types';
import {post} from 'axios';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import Proxy     from '../../../../utils/Proxy';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Header({ search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  const handleEditOpen = (classinfos) => {
    setOpenEdit(true);
  }

  /**
   * 모달 팝업 닫기
   */
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
            통계
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            월별 수업료 합산
          </Typography>
        </Grid>
        <Grid item>   
        </Grid>
      </Grid>

    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
