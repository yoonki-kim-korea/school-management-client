import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardMedia } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
  card: {
    width: theme.breakpoints.values.md,
    width: '100%',
    height: '100%',
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '100%',
      width: '100%'
    }
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(40),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

/**
 * 로그인 후 첫 화면 헤더
 * @param {*} param0 
 */
function Header({ className, ...rest }) {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/images/main.png"
          title="Cover"
        >
        </CardMedia>
      </Card>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
