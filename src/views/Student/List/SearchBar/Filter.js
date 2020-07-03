import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Divider,
  Drawer,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import CommonCode  from '../../../../utils/CommonCode';
import SpecialCommonCode from '../../../../utils/SpecialCommonCode';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 420,
    maxWidth: '100%'
  },
  header: {
    padding: theme.spacing(2, 1),
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    marginTop: 0,
    marginBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  tags: {
    marginTop: theme.spacing(1)
  },
  minAmount: {
    marginRight: theme.spacing(3)
  },
  maxAmount: {
    marginLeft: theme.spacing(3)
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  dateField: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));


/**
 * 재학생관리
 * @param {*} param0 
 */
function Filter({ open, onClose, className, onSearch, ...rest }) {

  const classes = useStyles();

  /**
   * 입력값 초기화
   */
  const handleClear = () => {
    document.getElementById('studentSearch').selectedIndex  = "0";
    document.getElementById('searchKeyword').value  = "";
    document.getElementById('gender').selectedIndex  = "0";
    document.getElementById('teacher').selectedIndex  = "0";
    document.getElementById('department').selectedIndex  = "0";
    document.getElementById('grade').selectedIndex  = "0";
    document.getElementById('classNo').selectedIndex  = "0";
    document.getElementById('classTime').selectedIndex  = "0";
    document.getElementById('studentDate').selectedIndex  = "0";
    document.getElementById('startDate').value  = "";
    document.getElementById('endDate').value  = "";    
  }

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant="temporary"
    >
        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={classes.buttonIcon} />
            닫기
          </Button>
        </div>
        <div className={classes.content}>
          <div className={classes.contentSection}>

            <Divider />
              <div className={classes.contentSectionContent}>
                <div className={classes.formGroup}>

                  {/** 검색조건 시작 */}
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="선택"
                    margin="dense"
                    id="studentSearch"
                    name="studentSearch"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="STUDENT_SEARCH" firstSelectYn="Y"/>
                  </TextField>
                </div>
                <div className={classes.formGroup}>
                  <div className={classes.fieldGroup}>
                    <TextField
                      className={clsx(classes.field, classes.flexGrow)}
                      label="검색어"
                      margin="dense"
                      id="searchKeyword"
                      name="searchKeyword"
                      variant="outlined"
                      onKeyPress={(event)=>{
                        if(event.which == 10 || event.which == 13) {
                          onSearch();
                        }
                      }}
                    />
                  </div>
                </div>
                {/** 검색조건 끝 */}

                {/** 성별 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="성별"
                    margin="dense"
                    id="gender"
                    name="gender"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="GENDER" firstSelectYn="Y"/>
                  </TextField>
                </div>
                {/** 성별 끝 */}
                                
                {/** 담임 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="담임"
                    margin="dense"
                    id="teacher"
                    name="teacher"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                  <SpecialCommonCode specialCode="teacher"  firstSelectYn="Y"/>   
                  </TextField>
                </div>
                {/** 담임 끝 */}
                
                {/** 부서 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="부서"
                    margin="dense"
                    id="department"
                    name="department"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="DEPARTMENT"  firstSelectYn="Y"/>   
                  </TextField>
                </div>
                {/** 부서 끝 */}                
                
                {/** 학년 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="학년"
                    margin="dense"
                    id="grade"
                    name="grade"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="GRADE"  firstSelectYn="Y"/> 
                  </TextField>
                </div>
                {/** 학년 끝 */}                        
                
                {/** 반 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="반"
                    margin="dense"
                    id="classNo"
                    name="classNo"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                  <CommonCode superCode="CLASS_NO"  firstSelectYn="Y"/>  
                  </TextField>
                </div>
                {/** 반 끝 */}                                
                
                {/** 시간구분 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="수업시간구분"
                    margin="dense"
                    id="classTime"
                    name="classTime"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="CLASS_TIME" firstSelectYn="Y"/>
                  </TextField>
                </div>
                {/** 시간구분 끝 */}
                
                {/** 날짜 시작 */}
                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label="날짜종류"
                    margin="dense"
                    id="studentDate"
                    name="studentDate"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <CommonCode superCode="STUDENT_DATE2" firstSelectYn="Y"/>
                  </TextField>
                </div>
                {/** 날짜종류 끝 */}

                {/** 입학일/생일 시작 */}
                <div className={classes.formGroup}>
                  <div className={classes.fieldGroup}>
                  <TextField
                      label="시작일"
                      id="startDate"
                      name="startDate"
                      type="date"
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />    

                    &nbsp;~&nbsp;

                    <TextField
                      label="종료일"
                      id="endDate"
                      name="endDate"
                      type="date"
                      className={classes.dateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />    
                </div>
              </div>
              {/** 입학일/생일 끝 */}

              </div>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            fullWidth
            onClick={handleClear}
            variant="contained"
          >
            <DeleteIcon className={classes.buttonIcon} />
            검색 조건 초기화
          </Button>

          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={onSearch}
          >
            검색
          </Button>
        </div>
    </Drawer>
  );
}

Filter.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default Filter;
