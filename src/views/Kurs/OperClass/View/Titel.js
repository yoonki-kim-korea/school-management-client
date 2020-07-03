import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from '@material-ui/core';
  import DataExtract from '../../../../utils/DataExtract';

  /**
   * 운영학급관리 > 학생재배정 및 관리 상단 학급정보
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
  
  /**
   * 로딩 시 학급정보 조회
   */
  useEffect(() => {
    const fetchClassinfo = (classId) => {
      let query = '/api/operclass/list?classId=' + classId;
      callApi(query)
      .then(response => {
          let classbooks = response.classbooks;
          if(!!classbooks && classbooks.length == 1){
            setClassinfo(classbooks[0])
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
      <>
      <Table>          
        <TableHead>
          <TableRow>
              <TableCell >학기</TableCell>
              <TableCell >기간</TableCell>
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
            <TableCell>{DataExtract.getFommatedDate(classinfo.startDate, "-")}~{DataExtract.getFommatedDate(classinfo.endDate, "-")}</TableCell>
            <TableCell>{classinfo.departmentName}</TableCell>
            <TableCell>{classinfo.gradeName}</TableCell>
            <TableCell>{classinfo.classNoName}</TableCell>
            <TableCell>{classinfo.classTimeName}</TableCell>
            <TableCell>{classinfo.classTypeName}</TableCell>
            <TableCell>{classinfo.teacherName}</TableCell>
          </TableRow>
        </TableBody>
    </Table>
      {/**학생 전입 시 수강시작일을 입력한다. 그 날짜가 학기 내에 있는지 검증하기 위해 추가함. */}
      <input type="hidden" id="checkStartDate" value={classinfo.startDate}/>
      <input type="hidden" id="checkEndDate" value={classinfo.endDate}/>
    </>
    );
}

export default Titel;