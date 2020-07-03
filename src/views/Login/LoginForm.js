/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField } from '@material-ui/core';
import { login } from 'src/actions';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles((theme) => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

function LoginForm({ className, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const handleChange = (event) => {
    event.persist();

    setFormState((prevFormState) => ({
      ...prevFormState,
      values: {
        ...prevFormState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...prevFormState.touched,
        [event.target.name]: true
      }
    }));
   
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(login());
    history.push('/');
  };

  const hasError = (field) => (!!(formState.touched[field] && formState.errors[field]));

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {}
    }));
  }, [formState.values]);

  
  /**
   * API 호출
   * @param {*} query 
   */
  const callApi = async (query) => {
    const response = await fetch('/auth/login/check?' + query);
    const body = await response.json();
    return body;
  }

  /**
   * 로그인
   */
  const checkLogin = () => {
    let query = '';    
        query += 'id='        + document.getElementById('id').value;
        query += '&password=' + document.getElementById('password').value;  

    callApi(query)
    .then(response => {
      if(response.myuser.isSuccess === "Y"){
        dispatch(login());
        window.location.href = "/presentation";
      }else if(response.myuser.isSuccess === "N"){
        alert('아이디 또는 비밀번호를 잘못 입력하였습니다.');
        document.getElementById('id').focus();
      }else {
        alert('대기')
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      //onSubmit={handleSubmit}
    >
      <div className={classes.fields}>
        <TextField
          fullWidth
          label="ID"
          id="id"
          name="id"
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          error={hasError('password')}
          fullWidth
          helperText={
            hasError('password') ? formState.errors.password[0] : null
          }
          label="Password"
          name="password"
          id="password"
          onChange={handleChange}
          onKeyPress={(event)=>{
            if(event.which == 10 || event.which == 13) {
              checkLogin();
          }
          }}
          type="password"
          value={formState.values.password || ''}
          variant="outlined"
        />
      </div>
      <Button
        id="login"
        name="login"
        className={classes.submitButton}
        color="secondary"
        size="large"
        type="button"//type="submit"
        variant="contained"
        onClick={checkLogin}
      >
        Log in
      </Button>
    </form>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string
};

export default LoginForm;
