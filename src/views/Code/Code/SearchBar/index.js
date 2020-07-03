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

function SearchBar({ onSearch, callSuperCodeId, searchCodeOnlyOnetiem, className, ...rest }) {
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
          callSuperCodeId={callSuperCodeId}
          searchCodeOnlyOnetiem={searchCodeOnlyOnetiem}
        />
      </Grid>
    </Grid>
  );
}

SearchBar.propTypes = {
  className: PropTypes.string,
  searchOnlyTeacherName: PropTypes.func,
  onSearch: PropTypes.func
};

export default SearchBar;