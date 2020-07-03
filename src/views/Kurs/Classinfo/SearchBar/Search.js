import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Button,  } from '@material-ui/core';
import CommonCode from '../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBoxPaper: {marginRight:10},
  selectBox:{
    height: 42,
    width:130,
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

/**
 * 학급관리 > 신규학급 생성 및 관리
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
        name="semester"
        id="semester"
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
      <CommonCode superCode="DEPARTMENT" placeHolder="부서" firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="grade"
        id="grade"
        className={classes.selectBox}
      >                    
      <CommonCode superCode="GRADE" placeHolder="학년"  firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="classNo"
        id="classNo"
        className={classes.selectBox}
      >                    
      <CommonCode superCode="CLASS_NO" placeHolder="반"  firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="classNo"
        id="classNo"
        className={classes.selectBox}
      >                    
      <CommonCode superCode="CLASS_TIME" placeHolder="시간구분"  firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="classType"
        id="classType"
        className={classes.selectBox}
      >                    
      <CommonCode superCode="CLASS_TYPE" placeHolder="유형"  firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="teacher"
        id="teacher"
        className={classes.selectBox}
      >                     
      <SpecialCommonCode specialCode="teacher" placeHolder="담임" firstSelectYn="Y"/>   
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
      <select
        name="classroom"
        id="classroom"
        className={classes.selectBox}
      >                    
      <SpecialCommonCode specialCode="classroom" placeHolder="교실" firstSelectYn="Y"/>      
      </select>
    </Paper>
    <Paper className={classes.selectBoxPaper}>
    <FormControl component="fieldset">
      <FormLabel component="legend">학생배정상태</FormLabel>
      <RadioGroup aria-label="position" name="classStatus" id="classStatus" style={{display:'block', width:400, border:'none'}}>
        <FormControlLabel          
          value="NOASSIGN"
          control={<Radio id="classStatus1" color="primary" />}
          label="미배정"
          labelPlacement="bottom"
          style={{display:'inline-block', width:90}}
        />
        <FormControlLabel          
          value="ASSIGN"
          control={<Radio id="classStatus2" color="primary" />}
          label="배정"
          labelPlacement="bottom"
          style={{display:'inline-block', width:80}}
        />
        <FormControlLabel          
          value="NOASSIGN_ASSIGN"
          control={<Radio id="classStatus3" color="primary" />}
          label="전체"
          labelPlacement="bottom"
         style={{display:'inline-block', width:100}}
        />
      </RadioGroup>
    </FormControl>
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
