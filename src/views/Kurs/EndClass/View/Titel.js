import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from '@material-ui/core';

/**
 * 학급관리 > 종료학급관리 > 상세보기의 학급정보 조회
 * @param {*} param0 
 */  
function Titel({classId}) {
  const [classinfo, setClassinfo] = useState([]);
     
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch(query);
    const body = await response.json();
    return body;
  }
  
  useEffect(() => {
    const fetchClassinfo = (classId) => {
      let query = '/api/endclass/list?classId=' + classId;
      callApi(query)
      .then(response => {
          let results = response.results;
          if(!!results && results.length == 1){
            setClassinfo(results[0])
          }else{
            
          }     
      })  
      .catch((err) => {
         console.log(err);
      });
    };
    fetchClassinfo(classId);
  }, []);
 
    return (
      <Table>          
        <TableHead>
          <TableRow>
              <TableCell>학기</TableCell>
              <TableCell>부서</TableCell>
              <TableCell>학년</TableCell>
              <TableCell>반</TableCell>
              <TableCell>시간</TableCell>
              <TableCell>유형</TableCell>
              <TableCell>담임</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{classinfo.semesterName}</TableCell>
            <TableCell>{classinfo.departmentName}</TableCell>
            <TableCell>{classinfo.gradeName}</TableCell>
            <TableCell>{classinfo.classNoName}</TableCell>
            <TableCell>{classinfo.classTimeName}</TableCell>
            <TableCell>{classinfo.classTypeName}</TableCell>
            <TableCell>{classinfo.teacherName}</TableCell>
          </TableRow>
        </TableBody>
    </Table>
    );
}

export default Titel;