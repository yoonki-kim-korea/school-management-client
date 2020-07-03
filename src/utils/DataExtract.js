import React from 'react';
import { ExceptionMap } from "antd/lib/result";
import CommonCode from './CommonCode';
import Debug from './Debug';

const DataExtract = {

    /**
     * 연도를 문자 8자리만 반환한다.
     * @param {}} date 
     */
    getDateString : function(date)  {
        if(!date || date.length < 10) return '';
        return date.split("-")[0] + date.split("-")[1] + date.split("-")[2];
    },

    /**
     * 날짜 8자리 문자를 구분자로 나눠서 반환한다.
     * @param {*} date 
     * @param {*} delimiter 
     */
    getFommatedDate : function(date, delimiter) {
        if(!date) return '';
        return date.substring(0,4) + delimiter + date.substring(4,6) + delimiter + date.substring(6,8);
    },

    getFommatedDate2 : function(date, delimiter) {
        if(!date) return '';
        return date.substring(6,8) + delimiter + date.substring(4,6) + delimiter + date.substring(0,4);
    },

    /**
     * 학번을 구분자로 나눠서 반환한다.
     * @param {*} studentNo 
     * @param {*} delimiter 
     */
    getFommatedStudentNo : function(studentNo, delimiter) {
        if(!studentNo) return '';
        return studentNo.substring(0,2) + delimiter + studentNo.substring(2,3) + delimiter + studentNo.substring(3,6);
    },

    /**
     * 교직원 번호를 구분자로 나눠서 반환한다.
     * @param {*} teacherNo 
     * @param {*} delimiter 
     */
    getFommatedTeacherNo : function(teacherNo, delimiter) {
        if(!teacherNo) return '';
        return teacherNo.substring(0,2) + delimiter + teacherNo.substring(2,5);
    },

    /**
     * 셀렉트박스의 선택값을 반환한다.
     * @param {*} selectBox 
     */
    getSelectedValue : function(selectBox) {
        try {            
            let select = selectBox;
            let selectedValue = select.options[select.selectedIndex].value;
            return selectedValue ? selectedValue : '';
        } catch (error) {
            Debug.log(`getSelectedValue(${selectBox}) error=${error}`);
            return '';
        }
    },

    getSelectedText : function(selectBox) {
        try {            
            let select = selectBox;
            return select.options[select.selectedIndex].text;
        } catch (error) {
            Debug.log(`getSelectedText(${selectBox}) error=${error}`);
            return '';
        }
    },

    /**
     * 셀렉트박스의 선택값을 반환하되 그 값이 undefined 인 경우 대체값을 반환한다.
     * @param {*} selectBox 
     * @param {*} emptyValue 
     */
    getSelectedValueWithAlternative : function(selectBox, emptyValue) {
        let select = selectBox;
        let selectedValue = select.options[select.selectedIndex].value;
        return selectedValue ? selectedValue : emptyValue;
    },

    /**
     * 값이 undefined인 경우 null을 반환한다.
     * @param {*} data 
     */
    getEmpty : function(data){
        if(data){
            return data;
        }
        return '';
    },

    /**
     * 값이 undefined인 경우 대체값을 반환한다.
     * @param {*} data 
     */
    getEmptyWithAlternative : function(data, empty){
        if(data){
            return data;
        }
        return empty;
    },

    isNotNull : function (value) {
        if(value === undefined || value === null) {
            return false;
        }
        return true;
    },

    isNull : function (value) {
        if(value === undefined || value === null) {
            return true;
        }
        return false;
    },

    isNumber : function(value) {
        try {            
            value = parseInt(value);
            return typeof value === 'number' && isFinite(value);
        } catch (error) {
            Debug.log(error);
            throw ExceptionMap('숫자여부 확인 검사 실패');
        }
    },

    today : function(){
        let d = new Date();
        let currentDate = d.getFullYear() + "-" + ( d.getMonth() + 1 ) + "-" + d.getDate() + "-";
        let currentTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":";
        return currentDate + " " + currentTime;
    },

    todayDate : function(spliter){
        let d = new Date();
        let month = d.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = d.getDate();
        day = day < 10 ? "0"+day : day;
        return d.getFullYear() + spliter + month + spliter + day ; 
    },

    Euro : function(currency){
        if(!!currency && typeof currency === 'string'){
            return currency.split(".")[0];
        }
        return currency;
    },

    Cent : function(currency){
        if(!!currency && typeof currency === 'string'){
            return currency.split(".")[1];
        }
        return currency;
    },

    difference : function(a,b){
        let result =  parseFloat(a) - parseFloat(b);
        return result.toFixed(2);
    },

    /**
     * 숫자를 유로화 형식으로 출력한다.
     * @param {*} a 
     */
    money : function(a){
        let result =  parseFloat(a);
        result = result.toFixed(2);
        result = result.split('.')[0].replace(/,/gi, ".") + ',' + result.split('.')[1]
        return result;
    },

    applyMonths : function(year, startMonth, endMonth){
        let applyMonths = [];
        switch(startMonth){
            case "01": applyMonths.push(year + "01"); if(endMonth === "01") break;
            case "02": applyMonths.push(year + "02"); if(endMonth === "02") break;
            case "03": applyMonths.push(year + "03"); if(endMonth === "03") break;
            case "04": applyMonths.push(year + "04"); if(endMonth === "04") break;
            case "05": applyMonths.push(year + "05"); if(endMonth === "05") break;
            case "06": applyMonths.push(year + "06"); if(endMonth === "06") break;
            case "07": applyMonths.push(year + "07"); if(endMonth === "07") break;
            case "08": applyMonths.push(year + "08"); if(endMonth === "08") break;
            case "09": applyMonths.push(year + "09"); if(endMonth === "09") break;
            case "10": applyMonths.push(year + "10"); if(endMonth === "10") break;
            case "11": applyMonths.push(year + "11"); if(endMonth === "11") break;
            case "12": applyMonths.push(year + "12"); if(endMonth === "12") break;
        }
        return applyMonths.join("|");
    },
    
    /**
     * 문서정보 맵에서 값 추출
     * @param {*} documentInfo 
     * @param {*} itemId 
     */
    findItemValue : function(documentInfo, itemId)  {
        if(!documentInfo) return '';
        try {
            for(let i=0; i<documentInfo.length; i++){
                let doc = documentInfo[i];            
                if(doc.itemId === itemId){
                    return doc.itemValue;
                }
            }
        } catch (error) {
            Debug.log(`값을 찾을 수 없음`);
            return null;
        }
    },

    /**
     * 납입증명서에서 표시할 기간
     */
    getDuration  : function() {
        const delimiter = '.';
        let d = new Date();
        let month = d.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = d.getDate();
        day = day < 10 ? "0"+day : day;
        let currentDate = month + delimiter + day + delimiter + d.getFullYear() ; 
        let duration = "01.01." + d.getFullYear();
        return duration += " ~ " + currentDate; 
    },

    /**
     * 수업료 납부 관리의 월별 납부상태 셀랙트 박스 생성
     * @param {*} fee 수업료
     * @param {*} com 셀렉트 박스 표시를 결정할 값 T:표시, F:입학전, X:빈공간
     * @param {*} pay 지불여부 true: 노란색 셀렉트박스, false: 회색 셀렉트 박스
     * @param {*} func 셀렉트 박스의 변경 이벤트를 처리할 함수
     * @param {*} studentId 학생ID
     * @param {*} applyYear 적용연도
     * @param {*} applyMonth 적용월
     * @param {*} schoolfeeType 수업료유형 -  RE:정규수업, E1:비정규수업1, E2:비정규수업2
     * @param {*} index 셀렉트박스의 ID를 생성하기 위한 값
     */
    payment : function(fee, com, pay, func, studentId, applyYear, applyMonth, schoolfeeType, index){
        if(com.charAt(0) === 'F'){
        return (<b>*</b>);
        }
        else  if(com === 'UNKNOWN'){
            return <>UNKNOWN</>;
        }
        else if(com.charAt(0) === 'T'){
            if(!pay){
                return (
                    <>
                        {fee}<br/>
                        <select id={studentId + '-' + applyYear + '-' + applyMonth + '-' + index}
                                style={{height: 32,width:90, backgroundColor:'grey'}}                                
                                onChange={(event)=>{func('save', studentId, applyYear, applyMonth, event.target.value, schoolfeeType, fee, index)}}>                           
                            <CommonCode superCode="SCHOOL_FEE_STATUS" placeHolder="납부여부"  firstSelectYn="Y"/>      
                        </select>
                    </>
                );
            }
            else{
                return (
                    <>
                        {fee}<br/>
                        <select id={studentId + '-' + applyYear + '-' + applyMonth + '-' + index}
                                letiant="filled"
                                style={{height: 32,width:90, backgroundColor:'yellow'}}     
                                onChange={(event)=>{func('update', studentId, applyYear, applyMonth, event.target.value, schoolfeeType, fee, index)}}>                   
                            <CommonCode superCode="SCHOOL_FEE_STATUS" placeHolder="납부여부"  firstSelectYn="Y" selectedValue={pay}/>      
                        </select>
                    </>
                );
            }
        }
        else{
            return (
                <>
                    {com}?
                </>
            );
        }
    }
}


export default DataExtract;