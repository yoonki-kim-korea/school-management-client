import React,  {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import BatchPaymentModal from './BatchPaymentModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 수업료 납부
 * @param {*} param0 
 */
function Header({ search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  
  /**
   * 일괄입금 처리 모달 열기
   * @param {*} classinfos 
   */
  const handleEditOpen = (classinfos) => {
    setOpenEdit(true);
  }

  /**
   * 일괄입금 처리 모달 닫기
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
            수업료 및 문서관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            수업료 납부
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            일괄입금 처리
          </Button>       
          <BatchPaymentModal
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
