import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from './AuthContext';

function SecureRoute (props) {
  const token = React.useContext(AuthContext);
  if (!token || token == null || token === 'undefined') {
    alert('You must be logged in to complete this action.')
    return <Redirect to="/" />;
  } else return <Route {...props} />;
}

export default SecureRoute;
