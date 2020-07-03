import React, { Component } from "react";
import { Table, Button, Popconfirm, Row, Col, Icon, Upload } from "antd";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "./editable";
import Proxy from '../../../utils/Proxy';
import DataExtract from '../../../utils/DataExtract';
import {post} from 'axios';
import "antd/dist/antd.css";
import { isThisTypeNode } from "typescript";
import PerfectScrollbar from 'react-perfect-scrollbar';

export default class ExcelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      columns: [
        { title: "입학연도", dataIndex: "entranceYear",  editable: true  },
        { title: "입학부서", dataIndex: "entranceDpt",  editable: true  },
        { title: "한글성명", dataIndex: "koreanName",  editable: true  },
        { title: "독어 성", dataIndex: "germanFamilyName",  editable: true  },
        { title: "독어 명", dataIndex: "germanName",  editable: true  },
        { title: "생년월일", dataIndex: "birthday",  editable: true  },
        { title: "입학일자", dataIndex: "entranceDay",  editable: true  },
        { title: "출생지", dataIndex: "birthPlace",  editable: true  },
        { title: "성별", dataIndex: "gender",  editable: true  },
        { title: "우편번호", dataIndex: "plz",  editable: true  },
        { title: "주소-도시", dataIndex: "addressCity",  editable: true  },
        { title: "주소-상세", dataIndex: "addressDtl",  editable: true  },
        { title: "전화번호", dataIndex: "mobileNo",  editable: true  },
        { title: "이메일", dataIndex: "email",  editable: true  },
        { title: "부-성명(한글)", dataIndex: "fatherName",  editable: true  },
        { title: "부-성명(영문)", dataIndex: "fatherNameEng",  editable: true  },
        { title: "부-전화번호", dataIndex: "fatherPhoneNo",  editable: true  },
        { title: "모-성명(한글)", dataIndex: "motherName",  editable: true  },
        { title: "모-성명(영문)", dataIndex: "motherNameEng",  editable: true  },
        { title: "모-전화번호", dataIndex: "motherPhoneNo",  editable: true  },
        { title: "대표여부", dataIndex: "representYn",  editable: true  },
        { title: "은행", dataIndex: "bank",  editable: true  },
        { title: "계좌번호", dataIndex: "accountNo",  editable: true  },
        { title: "계좌주", dataIndex: "accountHolder",  editable: true  },
        { title: "IBAN", dataIndex: "iban",  editable: true  },
        { title: "BIC", dataIndex: "bic",  editable: true  },

        {
          title: "Action",
          dataIndex: "action",
          render: (text, record) =>
            this.state.rows.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ color: "red", fontSize: "20px" }}
                />
              </Popconfirm>
            ) : null
        }
      ]
    };
  }//constructor

  handleSave = row => {
    const newData = [...this.state.rows];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };//handleSave

  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel = file[0].type === "application/vnd.ms-excel" ||
                    file[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    //console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    //console.log("errorMessage", errorMessage);
    return errorMessage;
  }//checkFile

  fileHandler = fileList => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    //console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({ rrorMessage: "Unknown file format. Only Excel files are uploaded!" });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if(row[0]) { 
            newRows.push({
              key: index,
              entranceYear: row[0],           /** A 입학연도  */
              entranceDpt: row[1],            /** B 입학부서 */
              koreanName: row[2],             /** C 한글성명 */
              germanFamilyName: row[3],       /** D 독어 성 */
              germanName: row[4],             /** E 독어 명 */
              birthday: row[5],               /** F 생년월일 */
              entranceDay: row[6],            /** G 입학일 */
              birthPlace: row[7],             /** H 출생지 */
              gender: row[8],                 /** I 성별 */
              plz: row[9],                    /** J 우편번호 */
              addressCity: row[10],           /** K 주소(도시) */
              addressDtl: row[11],            /** L 주소(상세) */
              mobileNo: row[12],              /** M 전화번호 */
              email: row[13],                 /** N 이메일 */
              fatherName: row[14],            /** O 부-성명(한글) */
              fatherNameEng: row[15],         /** P 부-성명(영문) */
              fatherPhoneNo: row[16],         /** Q 부-핸드폰 */
              motherName: row[17],            /** R 모-성명(한글) */
              motherNameEng: row[18],         /** S 모-성명(영문) */
              motherPhoneNo: row[19],         /** T 모-핸드폰 */
              representYn: row[20],           /** U 대표여부 */
              bank: row[21],                  /** V 은행 */
              accountNo: row[22],             /** W 계좌번호 */
              accountHolder: row[23],         /** X 계좌번호 */
              iban: row[24],                  /** Y iban */
              bic: row[25]                    /** Z bic */
            });
          }//if
        });
        if (newRows.length === 0) {
          this.setState({ errorMessage: "No data found in file!" });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null
          });
        }
      }
    });
    return false;
  };//fileHandler

  /**
   * 엑셀 데이터를 저장하기 위한 값으로 변환한다.
   */
  handleSubmit = async () => {
    const url = '/api/student/excel/save';
    const formData = new FormData();
    formData.append('totalCount', this.state.rows.length);  

    let studentList = new Array();
    let tempList = this.state.rows;
    for(let i=0; i<tempList.length; i++){
      let temp = tempList[i];
      let student = {};

      //입학연도
      let year = new String(temp.entranceYear);
      if(year.length !== 4){
        alert(`${i+1} 줄에서 입학연도가 입력되지 않았거나 잘못된 값이 입력되었습니다.`);
        return;
      }
      student.entranceYear = year.substr(2,2);

      switch(temp.entranceDpt){
        case '유치부':   student.entranceDpt = '1'; break;
        case '초등부':   student.entranceDpt = '2'; break;
        case '중등부':   student.entranceDpt = '3'; break;
        case '고등부':   student.entranceDpt = '4'; break;
        case '한국어부': student.entranceDpt = '5'; break;
        case '오후초등': student.entranceDpt = '6'; break;
        case '특별활동': student.entranceDpt = '7'; break;
        default: alert(`${i+1} 줄에서 존재하지 않은 부서가 발견되었습니다.`);return;
      }
      student.koreanName = DataExtract.getEmptyWithAlternative(temp.koreanName,'');
      student.germanName = DataExtract.getEmptyWithAlternative(temp.germanName, '') + ' ' + DataExtract.getEmptyWithAlternative(temp.germanFamilyName, '');

      if(!!temp.birthday){
        student.birthday = temp.birthday.split('-')[0] + temp.birthday.split('-')[1] + temp.birthday.split('-')[2];
      }else{
        student.birthday = '';
      }

      if(!!temp.entranceDay){
        student.entranceDay = temp.entranceDay.split('-')[0] + temp.entranceDay.split('-')[1] + temp.entranceDay.split('-')[2];
      }else{
        student.entranceDay = '';
      }
      
      switch(temp.birthPlace){
        case '대한민국': student.birthPlace = 'KR'; break;
        case '독일':     student.birthPlace = 'DE'; break;
        case '기타':     student.birthPlace = 'ZB'; break;
        default: student.birthPlace = '';
      }

      switch(temp.gender){
        case '남자': 
        case 'M': student.gender = 'M'; break;

        case '여자': 
        case 'F' : 
        case 'W'  : student.gender = 'W'; break;
        default: student.gender = '';
      }

      student.plz = DataExtract.getEmptyWithAlternative(temp.plz, '');
      student.addressCity = DataExtract.getEmptyWithAlternative(temp.addressCity, '');
      student.addressDtl = DataExtract.getEmptyWithAlternative(temp.addressDtl, '');
      student.mobileNo = DataExtract.getEmptyWithAlternative(temp.mobileNo, '');
      student.email = DataExtract.getEmptyWithAlternative(temp.email, '');
      student.fatherName = DataExtract.getEmptyWithAlternative(temp.fatherName, '');
      student.fatherNameEng = DataExtract.getEmptyWithAlternative(temp.fatherNameEng, '');
      student.fatherPhoneNo = DataExtract.getEmptyWithAlternative(temp.fatherPhoneNo, '');
      student.motherName = DataExtract.getEmptyWithAlternative(temp.motherName, '');
      student.motherNameEng = DataExtract.getEmptyWithAlternative(temp.motherNameEng, '');
      student.motherPhoneNo = DataExtract.getEmptyWithAlternative(temp.motherPhoneNo, '');

      if(student.plz !== '' && student.plz.length !== 5){
        alert(`${i+1} 줄에서 우편번호가 5자리가 아닙니다. 만일 모를 경우 빈 상태로 저장해야 합니다.`); return;   
      }

      if(!!temp.representYn){
        switch(temp.representYn.toLowerCase() ){
          case '예': 
          case 'ja' : 
          case 'yes' : 
          case 'y':
          case 'Y': student.representYn = 'Y'; break;
  
          case '아니오': 
          case 'nein' : 
          case 'no' : 
          case 'n':
          case 'N'  : student.representYn = 'N'; break;
          default: student.representYn = 'N';
        }
      }else{
        student.representYn = 'N';
      }      

      switch(temp.bank){
        case 'Deutsche Bank': student.bank = 'DB'; break;
        case 'Commerz Bank'  : student.bank = 'CB'; break;
        default: student.bank = '';
      }

      student.accountNo = DataExtract.getEmptyWithAlternative(temp.accountNo, '');
      student.accountHolder = DataExtract.getEmptyWithAlternative(temp.accountHolder, '');
      student.iban = DataExtract.getEmptyWithAlternative(temp.iban, '');
      student.bic = DataExtract.getEmptyWithAlternative(temp.bic, '');

      studentList.push(student);
    }//for

    if(studentList.length === 0){
      alert('데이터에 문제가 있어서 저장할 수 없습니다.');
      return;
    }

    formData.append('studentList', JSON.stringify({studentList}) );  
      
    const config = {
        headers : { 'content-type' : 'multipart/form-data' },
        proxy: Proxy.ProxyConfig
    }
    try {
      post(url, formData, config, Response)
      .then(response => {
        if(response.data.result === "success"){  
          alert('저장되었습니다.'); //alert(response.data.msg);
        }else{
          alert('저장 실패'); //alert(response.data.msg);
        }
        this.setState({ rows: [] })
      });
    } catch (error) {
      alert(`저장 실패 ${error}`)
    }
  }//handleSubmit

  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };//handleDelete

  handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count,      
      entranceYear:'',
      entranceDpt:'',
      koreanName:'',
      germanFamilyName:'',
      germanName:'',
      birthday:'',
      entranceDay:'',
      birthPlace:'',
      gender:'',
      plz:'',
      addressCity:'',
      addressDtl:'',
      mobileNo:'',
      email:'',
      fatherName:'',
      fatherNameEng:'',
      fatherPhoneNo:'',
      motherName:'',
      motherNameEng:'',
      motherPhoneNo:'',
      representYn:'',
      bank:'',
      accountNo:'',
      accountHolder:'',
      iban:'',
      bic:''
    };
    this.setState({
      rows: [newData, ...rows],
      count: count + 1
    });
  };//handleAdd

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <>
        <Row gutter={6}>

          <Col span={3}>
            <a
              href="/excelSamples/student_excel_upload_sample.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              엑셀 업로드 샘플
            </a>
          </Col>
          <Col
            span={3}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <>
                <Button
                  onClick={this.handleAdd}
                  size="large"
                  type="info"
                  style={{ marginBottom: 16 }}
                >
                  <Icon type="plus" />
                  Add a row
                </Button>{" "}
                <Button
                  onClick={this.handleSubmit}
                  size="large"
                  type="primary"
                  style={{ marginBottom: 16, marginLeft: 10 }}
                >
                  저장
                </Button>
              </>
            )}
          </Col>
        </Row>

        <div>
          <Upload
            id="uploadBtn"
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
            <Button>
              <Icon type="upload" /> 엑셀 파일 찾기
            </Button>
          </Upload>
        </div>
        <PerfectScrollbar>
        <div style={{ marginTop: 20 }}>
          <Table
            style={{border:'1px solid', width:3000}}
            components={components}
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div></PerfectScrollbar>
      </>
    );
  }//render
}
