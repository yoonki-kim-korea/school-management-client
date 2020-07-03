import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import DataExtract from '../../../utils/DataExtract';
import CodeInsertModal from './CodeInsertModal';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Header({ superCodeId, search, className, ...rest }) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [newSuperCodeId, setNewSuperCodeId] = useState(false);
  const [newSuperCodeName, setNewSuperCodeName] = useState(false);
  
  /**
   * 공통코드 신규 모달 팝업 호출
   */
  const handleEditOpen = () => {
    /**
     * 추가할 공통코드의 슈퍼코드의 SUPER_CODE_ID
     */
    let superCodeId = DataExtract.getSelectedValue( document.getElementById('superCodeId'));
    if(!superCodeId){
      alert("코드 추가를 위해 슈퍼코드를 선택해야 합니다.");
      return;
    }
    let superCodeName = DataExtract.getSelectedText( document.getElementById('superCodeId'));
    setNewSuperCodeName(superCodeName);
    setNewSuperCodeId(superCodeId);
    setOpenEdit(true);
  }

  /**
   * 모달 팝업 닫기
   */
  const handleEditClose = () => {
    setOpenEdit(false); 
  }

  const handleEditSaveAndClose = () => {
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
            공통코드 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            코드 추가
          </Button>
          {/** 공통코드 신규 생성 모달 팝업 */}          
          <CodeInsertModal
              onSaveAndClose={handleEditSaveAndClose}
              onClose={handleEditClose}
              open={openEdit}
              search={search}
              newSuperCodeId={newSuperCodeId}
              newSuperCodeName={newSuperCodeName}
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
