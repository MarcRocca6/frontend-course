import React from 'react';
import LoginForm from '../components/Registration/LoginForm';
import PropTypes from 'prop-types';

const Login = ({ setAuth, ...props }) => {
  return (
    <>
      <div className="container">
        <br></br>
        <LoginForm {...props} setAuth={setAuth} />
      </div>
    </>
  )
};

export default Login;

Login.propTypes = {
  setAuth: PropTypes.func,
};
