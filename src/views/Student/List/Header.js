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
 * 재학생 관리
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
   * 학생대표 학부모 조회
   */
  const getRepresents = async () => {
    let rtnResults;
    let query = `/api/represent/list`; 
      await callApi(query)
      .then(response => {
        if(response.results.length == 0){
          alert(`학생대표 부재`);
        }        
        rtnResults = response.results;
      })
      .catch(err => console.log(err));
      return rtnResults
  }//getRepresents
  
  /**
   * 전체학생 조회
   */
  const getAllStudents = async () => {
    let rtnResults;
    let query = `/api/allstudents/list`; 
      await callApi(query)
      .then(response => {
        if(response.results.length == 0){
          alert(`학생 부재`);
        }        
        rtnResults = response.results;
      })
      .catch(err => console.log(err));
      return rtnResults
  }//getAllStudents

  /**
   * 학부모대표 엑셀변환
   */
  const print = async () => {
    document.getElementById('excelBtn2').innerHTML = "생성중. 클릭금지";
    let results = await getRepresents();
    makeExcel(results);
  }//print

  /**
   * 전체학생 엑셀변환
   */
  const printAll = async () => {
    document.getElementById('excelBtn').innerHTML = "생성중. 클릭금지";
    let results = await getAllStudents();
    makeAllExcel(results);
  }//print

  /**
   * 학부모대표 엑셀 생성
   * @param {*} results 
   */
  const makeExcel = async (results) => {  
    const url = '/api/represent/excel';
    const formData = new FormData();    
    formData.append('results', JSON.stringify(results));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        document.getElementById('excelBtn2').innerHTML = "학부무 대표 출력";   
        if(response.data.result === "success"){               
          alert(`${ExcelInfo.RepresentDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });
  }//

  /**
   * 전체학생 엑셀 생성
   * @param {*} results 
   */
  const makeAllExcel = async (results) => {  
    const url = '/api/allstudents/excel';
    const formData = new FormData();    
    formData.append('results', JSON.stringify(results));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        document.getElementById('excelBtn').innerHTML = "재학생 전체 학생 출력";     
        if(response.data.result === "success"){          
          alert(`${ExcelInfo.AllstudentsDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });
  }//makeAllExcel

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
            학생관리
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            재학생 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            className={classes.topbtn}
            href="/student/insert/basicInfo"
          >
            학생 추가
          </Button>
          <Button
            id="excelBtn2"
            color="primary"
            className={classes.topbtn}
            variant="contained"
            onClick={print}
          >
            학부모 대표 출력
          </Button>
          <Button
            id="excelBtn"
            color="primary"
            className={classes.topbtn}
            variant="contained"
            onClick={printAll}
          >
            재학생 전체 학생 출력
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
