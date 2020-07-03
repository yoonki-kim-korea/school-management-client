import React from 'react';
import PropTypes from 'prop-types';
import {post} from 'axios';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { 
  Grid, Typography, Button 
} from '@material-ui/core';
import Proxy     from '../../../utils/Proxy';
import ExcelInfo     from '../../../utils/ExcelInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

/**
 * 운영학급관리
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
   * 학급별 주소록
   * @param {*} classinfo 
   */
  const getAddresses = async (classinfo) => {
    let rtnAddress;
    let query = `/api/operclass/address/list?classId=${classinfo.classId}`; 
      await callApi(query)
      .then(response => {
        if(response.address.length == 0){
          alert(`주소록을 인쇄할 학생목록이 없음.`);
        }        
        rtnAddress = response.address;
      })
      .catch(err => console.log(err));
      return rtnAddress
  }//getAddresses

  /**
   * 출석부에 들어갈 학급정보 조회
   */
  const getClassbook = async () => {
    let classinfos = [];
    let query = `/api/operclass/excel/list`;
    await callApi(query)
    .then(response => {
      if(response.classinfos.length == 0){
        alert("출석부를 인쇄할 학급이 없습니다.");
      }
      classinfos = response.classinfos;    
    })
    .catch(err => console.log(err));
    return classinfos;
  }//getClassbook
  
  /**
   * 출석부 및 주소록 출력을 위한 객체 호출
   */
  const printClassbook = async () => {
    document.getElementById('excelBtn').innerHTML = "생성중. 클릭금지";
    let classinfos = await getClassbook();
    
    for(let i=0; i<classinfos.length; i++){
      classinfos[i].address = await getAddresses(classinfos[i]);
    }
    makeClassbook(classinfos);
  }//printClassbook

  /**
   * 전체 출석부 및 주소록
   * @param {*} classinfos 
   */
  const makeClassbook = async (classinfos) => {  
    const url = '/api/operclass/excel';
    const formData = new FormData();    
    formData.append('classinfos', JSON.stringify(classinfos));  
  
    const config = {
        headers : { 'content-type' : 'multipart/form-data'  },
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {
        document.getElementById('excelBtn').innerHTML = "전체 출석부 및 주소록 출력";     
        if(response.data.result === "success"){          
          alert(`${ExcelInfo.ClassbookDir} 폴더를 확인해주시기 바랍니다. 다음 번 출력을 위해 해당 폴더에 생성된 파일은 다른 곳으로 이동해주시기 바랍니다.`);
        }else{
          alert(response.data.message);
        }
    });
  }//makeClassbook

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
            운영 학급 관리
          </Typography>
        </Grid>
        <Grid item>
          <Button
            id="excelBtn"
            color="primary"
            variant="contained"
            onClick={printClassbook}
          >
            전체 출석부 및 주소록 출력
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
