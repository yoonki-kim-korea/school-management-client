import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
  }
}));

function Search({ onSearch, className, ...rest }) {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Paper
        className={classes.search}
        elevation={2}
        style={{marginRight:10}}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input id="superCode" name="superCode"
          className={classes.searchInput}
          disableUnderline
          placeholder="슈퍼코드"
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
        <Input id="superCodeName" name="superCodeName"
          className={classes.searchInput}
          disableUnderline
          placeholder="슈퍼코드명"
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
