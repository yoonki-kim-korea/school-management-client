import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import DataExtract from '../../../../utils/DataExtract';

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1150
  },
  methodCell: {
    width: 100
  },
  statusCell: {
    width: 64
  }
}));


function DocumentHistory({ studentId, className, ...rest }) {
  const classes = useStyles();
  const [results, setResults] = useState([]);

  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const url = '/api/student/document/hist?' + query;
    const response = await fetch(url);
    const body = await response.json();
    return body;
  }
  
  useEffect(() => {
    let mounted = true;

    const fetchSpecialAct = () => {
      let query = 'studentId=' + studentId;
      callApi(query)
      .then(response => {
        if (mounted) {
          setResults(response.results);
        }
      })
      .catch(err => console.log(err));
    }

    fetchSpecialAct();

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Divider />
      <CardContent className={classes.content}>
        <Table>              
          <TableHead>
            <TableRow>
              <TableCell align="center">문서종류</TableCell>
              <TableCell align="center">발급일자</TableCell>
              <TableCell align="center">발급번호</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {results.map(result => (
              <TableRow key={result.seqNo}> 
                <TableCell align="center">{result.documentType}</TableCell>
                <TableCell align="center">{DataExtract.getFommatedDate(result.issuedDate, '-')}</TableCell>
                <TableCell align="center">{result.seqNo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

DocumentHistory.propTypes = {
  className: PropTypes.string,
  student: PropTypes.object.isRequired
};

export default DocumentHistory;
