import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CommonCode from '../../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../../utils/SpecialCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBoxPaper: {marginRight:10},
  selectBox:{
    height: 42,
    width:120,
  },
  search: {
    flexGrow: 1,
    height: 42,
    width:250,
    marginRight:10,
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
    width:120
  },
  searchButton: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'left'
  },
  field: {
    flexGrow: 1,
    height: 42,
    width:300,
    //
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
}));

function Search({ onSearch, className, ...rest }) {
  const classes = useStyles();
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >      

      <Paper className={classes.selectBoxPaper}>
        <select
          name="semesterId"
          id="semesterId"
          className={classes.selectBox}
        >       
        <SpecialCommonCode specialCode="semester" placeHolder="학기" firstSelectYn="Y"/>                
        </select>
      </Paper>
        <Paper className={classes.selectBoxPaper}>
          <select
            name="department"
            id="department"
            className={classes.selectBox}
          >                    
          <CommonCode superCode="DEPARTMENT" placeHolder="부서"  firstSelectYn="Y"/>      
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
