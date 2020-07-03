import React, { useState }  from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {post} from 'axios';
import Proxy       from '../../../../utils/Proxy';
import Typography from '@material-ui/core/Typography';
import DataExtract from '../../../../utils/DataExtract';

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto"
  },
  paper: {
    width: 600,
    height: 400,
    overflow: "auto"
  },
  button: {
    margin: theme.spacing(0.5, 0)
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

/**
 * 학생배정 모달의 그리드
 * @param {*} param0 
 */
export default function TransferList({candidates : left, setCandidates : setLeft, classinfo, modalClose, assignList, searchList}) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [right, setRight] = useState(assignList);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  /**
   * 배정 저장
   */
  const saveAssigned = () => {

    if(right.length <= 0){
        alert("배정된 학생이 없습니다.");
        return;
    }
    
    const url = '/api/classinfo/assigned/save';
    const formData = new FormData();
    const ids = getIds(right);
    formData.append('classId', classinfo.classId);  
    formData.append('startDate', classinfo.startDate);//수강생들의 수강시작일로서 학기의 시작일  
    formData.append('student_ids', ids);  
    formData.append('creId', 'root');  
    
    const config = {
        headers : {'content-type' : 'multipart/form-data'},
        proxy: Proxy.ProxyConfig
    }

    post(url, formData, config, Response)
    .then(response => {

        if(response.data.result === "success"){            
          alert('저장 성공');
        }else{
          alert('저장 실패');
        }
    });
  }//saveAssigned

  /**
   * 
   * @param {*} list 
   */
  const getIds = (list) => {
      let ids = new Array();
      for(let i=0; i<list.length; i++){
        ids.push(list[i].studentId);
      }
      return ids.join(',');
  }

  /**
   * 조회한 배정후보생 수 표시
   * @param {*} cnt 
   */
  const setCandidateCount =  (cnt) => {
    document.getElementById('candidateCount').innerHTML = cnt;
  }

  /**
   * 왼쪽에서 선택한 후보생 수 표시
   * @param {*} cnt 
   */
  const setCandidateSelectCount =  (cnt) => {
    document.getElementById('candidateSelectCount').innerHTML = cnt == 0 ? '' : `중 ${cnt} 명 선택`;
  }

  /**
   * 선택한 배정학생 수 표시
   * @param {*} cnt 
   */
  const setAssignSelectCount =  (cnt) => {
    document.getElementById('assignSelectCount').innerHTML = cnt == 0 ? '' : `중 ${cnt} 명 선택`;
  }

  /**
   * 조회한 배정학생 수 표시
   * @param {*} cnt 
   */
  const setAssignCount =  (cnt) => {
    document.getElementById('assignCount').innerHTML = cnt;
  }

  /**
   * 체크박스 토글
   * @param {*} value 
   * @param {*} direction 
   */
  const handleToggle = (value,direction) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    switch(direction){
      case 'left':
        setCandidateSelectCount(newChecked.length);
        break;
      case 'right':
        setAssignSelectCount(newChecked.length);
        break;
    }
  };

  /**
   * 전체 이동- 좌->우 전체 후보학생을 배정학생으로 이동
   */
  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setCandidateCount(right.length);
    setAssignCount(0);
    setCandidateSelectCount(0);
  };

  /**
   * 선택한 후보학생을 배정학생으로 이동
   */
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setCandidateCount(right.length);
    setAssignCount(left.length);
    setCandidateSelectCount(0);
  };

  /**
   * 선택한 배정학생을 후보학생으로 이동
   */
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setCandidateCount(right.length);
    setAssignCount(left.length);
    setAssignSelectCount(0);
  };

  /**
   * 전체 이동- 우->좌 전체 배정학생을 후보학생으로 이동
   */
  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    setCandidateCount(0);
    setAssignCount(left.length);
    setAssignSelectCount(0);
  };

  /**
   * 
   * @param {*} students 
   * @param {*} direction 
   */
  const customList = (students, direction) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {students.map(student => {
          const labelId = `transfer-list-item-${student.studentId}-label`;

          return (
            <ListItem
              key={student.studentId}
              role="listitem"
              button
              onClick={handleToggle(student, direction)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(student) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`[${student.studentNo}] ${student.koreanName} (${DataExtract.getFommatedDate(student.birthday,'.')})`}
                secondary={`${!!student.department ? student.department : ''} ${!!student.className ? student.className : ''} ${!!student.classStatus ? student.classStatus : ''}`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >      
      <Grid item spacing={2}>
        <Grid item>
          <Typography variant="h6" className={classes.title}>
          배정 후보 학생 : {<span id="candidateCount">{left.length}</span>} 명 {<span id="candidateSelectCount"></span>}
          </Typography>          
        </Grid>
        <Grid item>{customList(left, 'left')}</Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button> <button id="saveBtn" onClick={() => { saveAssigned();  }} />
        </Grid>
      </Grid>
      <Grid item spacing={2}>
        <Grid item>
          <Typography variant="h6" className={classes.title}>
            배정된 학생 : {<span id="assignCount">{right.length}</span>} 명 {<span id="assignSelectCount"></span>}
          </Typography>
        </Grid>
        <Grid item>
          {customList(right, 'right')}
        </Grid>
      </Grid>
    </Grid>
  );
}
