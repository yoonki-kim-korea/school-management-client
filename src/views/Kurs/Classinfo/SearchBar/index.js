import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Search from './Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  search: {
    flexGrow: 1,
    maxWidth: 1080,
    flexBasis: 1080
  },
  filterButton: {
    marginLeft: 'auto'
  },
  filterIcon: {
    marginRight: theme.spacing(1)
  }
}));

/**
 * 학급관리 > 신규학급 생성 및 관리
 * @param {*} param0 
 */
function SearchBar({ onSearch, className, ...rest }) {
  const classes = useStyles();
  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid >
        <Search
          className={classes.search}
          onSearch={onSearch}
        />
      </Grid>
    </Grid>
  );
}

SearchBar.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func
};

export default SearchBar;