import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import ClassinfoInsertModal from './modals/ClassinfoInsertModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 신규 학급 생성 및 관리
 * @param {*} param0 
 */
function Header({ search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  /**
   * 신규학급 추가 모달 열기
   */
  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  /**
   * 신규학급 추가 모달 닫기
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
            신규학급 생성 및 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            학급 추가
          </Button>
          {/** 신규학급 추가 모달 팝업 */}          
          <ClassinfoInsertModal
              onClose={handleEditClose}
              open={openEdit}
              search={search}
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
