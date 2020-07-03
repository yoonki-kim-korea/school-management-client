import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input } from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  search: {
    flexGrow: 1,
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon  

  },
  searchInput: {
    flexGrow: 1,
  },
  searchButton: {
    marginLeft: theme.spacing(2)
  },
  selectBox:{
    height: 42,
    width:300,
  },
}));

function Search({ onSearch, className, ...rest }) {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
       <Paper >
        <select
          name="documentId"
          id="documentId"
          className={classes.selectBox}
        >                    
          <CommonCode superCode="DOCUMENT" firstSelectYn="N" placeHolder="문서"/>
        </select>
      </Paper>
      <Button
        className={classes.searchButton}
        onClick={onSearch}
        color="primary"
        variant="contained"
      >
        검색
      </Button>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func
};

export default Search;
