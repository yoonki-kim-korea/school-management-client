import React,  {useState} from 'react';
import PropTypes from 'prop-types';
import {post} from 'axios';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import Proxy     from '../../../../utils/Proxy';
import ExcelInfo     from '../../../../utils/ExcelInfo';
import DataExtract from '../../../../utils/DataExtract';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 수업료 납부현황
 * @param {*} param0 
 */
function Header({ search, className, ...rest }) {
  const classes = useStyles();

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }
  
  /**
   * 미납자 조회
   */
  const getDefaulters = async () => {
    let rtnResults;
    let query = `/api/defaulter/list`; 
        query += '?applyYear=' + DataExtract.getSelectedValueWithAlternative( document.getElementById('applyYear'), '');
      await callApi(query)
      .then(response => {
        if(response.results.length == 0){
          alert(`미납자 부재`);
        }        
        rtnResults = response.results;
      })
      .catch(err => console.log(err));
      return rtnResults
  }//getAddresses
  
  /**
   * 미납자 명단 출력
   */
  const printDefaulterList = async () => {
    
    if(!DataExtract.getSelectedValue(document.getElementById('applyYear'))) {
      alert("적용연도를 선택해야 합니다.");
      return;
    }
    document.getElementById('excelBtn').innerHTML = "생성중. 클릭금지";
    let results = await getDefaulters();
    makeExcel(results);
  }//printClassbook

  /**
   * 엑셀 생성
   * @param {*} results 
   */
  const makeExcel = async (results) => {  
    const url = '/api/defaulter/excel';
    const formData = new FormData();    
    formData.append('results', JSON.stringify(results));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        document.getElementById('excelBtn').innerHTML = "미납자 명단 출력";   
        if(response.data.result === "success"){     
          alert(`${ExcelInfo.DefaulterDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });    
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
            수업료 납부현황
          </Typography>
        </Grid>
        <Grid item>
          <Button
            id="excelBtn"
            color="primary"
            variant="contained"
            onClick={printDefaulterList}
          >
            미납자 명단 출력
          </Button>
        </Grid>
      </Grid>
      
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
