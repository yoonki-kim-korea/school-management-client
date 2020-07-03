import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  },
  logoText:{ 
    display:'flex',   border:'none', color:'white'
  }
}));

/**
 * 로그인 페이지의 상단 바
 * @param {*} param0 
 */
function Topbar({ className, ...rest }) {
  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
    >
      <Toolbar>
        <RouterLink to="/">
          <div className={classes.logoText}>
            <SchoolIcon style={{marginRight:'5px'}}/>프랑크푸르트 한국학교 학사관리 시스템
          </div>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
}

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
