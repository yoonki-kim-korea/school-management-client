import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import {post} from 'axios';
import ExcelInfo     from '../../../utils/ExcelInfo';

const useStyles = makeStyles(() => ({
  root: {},
  
  topbtn:{
    display:'inline-block', 
    marginLeft: '10px'
  },
}));

/**
 * 교직원 관리
 * @param {*} param0 
 */
function Header({ className, ...rest }) {
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
   * 교사비상연락망 조회
   */
  const getEmergency = async () => {
    let rtnResults;
    let query = `/api/emergency/list`; 
      await callApi(query)
      .then(response => {
        if(response.results.length == 0){
          alert(`교사비상연락망 부재`);
        }        
        rtnResults = response.results;
      })
      .catch(err => console.log(err));
      return rtnResults
  }//getAddresses

  /**
   * 엑셀변환
   */
  const print = async () => {
    document.getElementById('excelBtn').innerHTML = "생성중. 클릭금지";
    let results = await getEmergency();
    makeExcel(results);
  }//printClassbook

  /**
   * 교사비상연락망 엑셀 생성
   * @param {*} results 
   */
  const makeExcel = async (results) => {  
    const url = '/api/emergency/excel';
    const formData = new FormData();    
    formData.append('results', JSON.stringify(results));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        document.getElementById('excelBtn').innerHTML = "교사비상연락망";   
        if(response.data.result === "success"){         
          alert(`${ExcelInfo.EmergencyDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
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
            교직원관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            교직원 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            className={classes.topbtn}
            href="/teacher/insert/basicInfo"
          >
            교직원 추가
          </Button>
          <Button
            id="excelBtn"
            color="primary"
            className={classes.topbtn}
            variant="contained"
            onClick={print}
          >
            교사비상연락망
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
