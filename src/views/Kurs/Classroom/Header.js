import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import ClassroomInsertModal from './ClassroomInsertModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 교실 관리
 * @param {*} param0 
 */
function Header({ search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  /**
   * 교실 추가 모달 열기
   */
  const handleEditOpen = () => {
    setOpenEdit(true);
  }

  /**
   * 교실 추가 모달 닫기
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
            교실 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            교실 추가
          </Button>
          {/** 교실 신규 생성 모달 팝업 */}          
          <ClassroomInsertModal
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
