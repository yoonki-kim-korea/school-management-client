import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SuperCommonCode from '../../../../utils/SuperCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
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
    //
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
}));

function Search({ onSearch, callSuperCodeId, searchCodeOnlyOnetiem, className, ...rest }) {
  const classes = useStyles();
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Paper style={{marginRight:10}}>
        <select
          name="superCodeId"
          id="superCodeId"
          className={classes.selectBox}
        >                    
        <SuperCommonCode selectedValue={callSuperCodeId} searchCodeOnlyOnetiem={searchCodeOnlyOnetiem}/>    
        </select>
      </Paper>
      <Paper
        className={classes.search}
        elevation={2}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input id="code" name="code"
          className={classes.searchInput}
          disableUnderline
          placeholder="코드"
          onKeyPress={(event)=>{
            if(event.which == 10 || event.which == 13) {
              onSearch();
            }
          }}
        />
      </Paper>
      <Paper
        className={classes.search}
        elevation={2}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input id="codeName" name="codeName"
          className={classes.searchInput}
          disableUnderline
          placeholder="코드명"
          onKeyPress={(event)=>{
            if(event.which == 10 || event.which == 13) {
              onSearch();
            }
          }}
        />
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
