import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import DiaryInsertModal from './DiaryInsertModal';

const useStyles = makeStyles(() => ({
  root: {},
  topBtn:{
    marginLeft:10
  }
}));

/**
 * 학생별 메모
 * @param {*} param0 
 */
function Header({ studentId, search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  /**
   * 사용자 신규 모달 팝업 호출
   */
  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  /**
   * 모달 팝업 닫기
   */
  const handleEditClose = () => {
    setOpenEdit(false); 
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            학급 관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            학생별 메모
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"      
            onClick={()=>{window.history.back();}}
          >
            뒤로
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.topBtn}
            onClick={handleEditOpen}
          >
            메모 추가
          </Button>
          {/** 사용자 신규 생성 모달 팝업 */}          
          <DiaryInsertModal
              onClose={handleEditClose}
              open={openEdit}
              search={search}
              studentId={studentId}
            />
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
