import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button} from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBoxPaper: {marginRight:10},
  selectBox:{
    height: 42,
    width:300,
  },
  search: {
    flexGrow: 1,
    height: 42,
    width:200,
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
    width:150
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
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
}));

/**
 * 학기관리
 * @param {*} param0 
 */
function Search({ onSearch, className, ...rest }) {
  const classes = useStyles();
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Paper className={classes.selectBoxPaper}>
        <select
          name="semesterYear"
          id="semesterYear"
          className={classes.selectBox}
        >       
        <CommonCode superCode="SEMESTER_YEAR" placeHolder="연도"/>                
        </select>
      </Paper>
      <Paper className={classes.selectBoxPaper}>
        <select
          name="semesterType"
          id="semesterType"
          className={classes.selectBox}
        >                    
        <CommonCode superCode="SEMESTER_TYPE" placeHolder="학기구분"/>    
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
