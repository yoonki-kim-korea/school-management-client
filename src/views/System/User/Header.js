import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import UserInsertModal from './UserInsertModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Header({ userId, search, className, ...rest }) {
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
            시스템 관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            사용자 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            사용자 추가
          </Button>
          {/** 사용자 신규 생성 모달 팝업 */}          
          <UserInsertModal
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
