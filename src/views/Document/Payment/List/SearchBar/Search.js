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
    width:110,
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
    width:90
  },
  searchButton: {
    width:95,
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'left',
    
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
 * 수업료 납부
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
        <select id="applyYear" name="applyYear" className={classes.selectBox}>
          <CommonCode superCode="SEMESTER_YEAR" firstSelectYn="N" placeHolder="적용연도"/>
        </select>
      </Paper>

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
          name="teacherId"
          id="teacherId"
          className={classes.selectBox}
        >                     
        <SpecialCommonCode specialCode="teacher" placeHolder="담임" firstSelectYn="Y"/>   
        </select>
      </Paper>
      <Paper className={classes.selectBoxPaper}>
        <select
          name="schoolFeeType"
          id="schoolFeeType"
          className={classes.selectBox}
        >                    
        <CommonCode superCode="SCHOOLFEE_TYPE" placeHolder="수업료 유형" firstSelectYn="Y"/>       
        </select>
      </Paper>
      <Paper className={classes.selectBoxPaper}>
        <select
          name="studentStatus"
          id="studentStatus"
          className={classes.selectBox}
        >                    
        <CommonCode superCode="STUDENT_STATUS" placeHolder="재학상태" firstSelectYn="Y"/>       
        </select>
      </Paper>
      <Paper
        className={classes.search}
        elevation={2}
      >
        <SearchIcon/>
        <Input id="studentName" name="studentName"
          className={classes.searchInput}
          disableUnderline
          placeholder="성명"
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
        <SearchIcon/>
        <Input id="studentNo" name="studentNo"
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
      <Paper>
        <Button id="searchBtn" 
                className={classes.searchButton}
                onClick={onSearch}
                color="primary"
                variant="contained"
        >
          검색
        </Button>
      </Paper>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func
};

export default Search;
