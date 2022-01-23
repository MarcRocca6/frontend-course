import React from 'react';
import RegisterForm from '../components/Registration/RegisterForm';
import PropTypes from 'prop-types';

const Register = ({ setAuth, ...props }) => {
  return (
    <>
      <div className="container">
        <br></br>
        <RegisterForm {...props} setAuth={setAuth} />
      </div>
    </>
  )
};

export default Register;

Register.propTypes = {
  setAuth: PropTypes.func,
};
