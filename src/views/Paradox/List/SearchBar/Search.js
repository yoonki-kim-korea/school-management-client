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
    width:200,
    marginRight:10,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'left'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon,
    
  },
  searchInput: {
    flexGrow: 1,
    width:150
  },
  searchButton: {
    marginLeft: theme.spacing(1),
    width:120,
    display: 'flex',
    alignItems: 'left'
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
      >
        <SearchIcon className={classes.searchIcon} /> 
        <Input id="snr" name="snr"
          className={classes.searchInput}
          disableUnderline
          placeholder="학번"
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
          <Input id="koreanname" name="koreanname"
            className={classes.searchInput}
            disableUnderline
            placeholder="한글성명"
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
            <Input id="vorname" name="vorname"
              className={classes.searchInput}
              disableUnderline
              placeholder="Vorname"
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
          <Input id="lastname" name="lastname"
            className={classes.searchInput}
            disableUnderline
            placeholder="Lastname"
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
          size="medium"
          variant="contained"
          color="primary"
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
