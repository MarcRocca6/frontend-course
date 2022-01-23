import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

LoginForm.propTypes = {
  setAuth: PropTypes.func,
  history: PropTypes.func,
};

export default function LoginForm ({ setAuth, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tickbox, setTickbox] = useState('');

  /* make email case insensitive */
  // email = email.toLowerCase();

  function validateForm () {
    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      if (password.length > 0) return true;
    }
    return false;
  }

  function handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        /* make email case insensitive */
        email: email.toLowerCase(),
        password: password,
      })
    })
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            sessionStorage.userToken = data.token;
            sessionStorage.userEmail = email;
            setAuth(data.token)
            props.history.push('/');
          });
        } else {
          response.json().then((err) => {
            console.log(err);
            alert(err.error);
          });
        }
      })
  }

  return (
    <div className="Login card text-black">
      <h1 className="text-center padding-bottom-xl" >Login</h1>
      <div className="card-body p-md-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="LoginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted" style={{ fontSize: '0.6em' }}>
              We will never share your personal information with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="LoginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="LoginCheckbox">
            <Form.Check
              type="checkbox"
              value={tickbox} onChange={(e) => setTickbox(e.target.checked)}
              label="Keep me logged in"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!validateForm()}>
            Log in
          </Button>
        </Form>
      </div>
    </div>
  );
}
