import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

Register.propTypes = {
  setAuth: PropTypes.func,
  history: PropTypes.func,
};

export default function Register ({ setAuth, ...props }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [tickbox, setTickbox] = useState('');

  function validateForm () {
    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      if (password1.length > 0 && password1 === password2) {
        if (username.length > 0) {
          if (tickbox) {
            return true;
          } else alert('Please accept the Term of Service');
        } else alert('Empty Username Field');
      } else alert('Empty Password or Passwords do not match');
    } else alert('Invalid Email Address');
    return false;
  }

  function handleSubmit (event) {
    event.preventDefault();
    if (validateForm()) {
      fetch('http://localhost:5005/user/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          /* make email case insensitive */
          email: email.toLowerCase(),
          password: password1,
          name: username,
        })
      })
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data.token)
              sessionStorage.userToken = data.token;
              setAuth(data.token)
              sessionStorage.userEmail = email;
              props.history.push('/');
            });
          } else {
            response.json().then((err) => {
              console.log(err);
              alert(err.error);
            });
          }
        })
    } else console.log('Invalid Form Entry');
  }

  return (
    <div className="Register card text-black">
      <h1 className="text-center padding-bottom-xl" >Registration</h1>
      <div className="card-body p-md-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="RegisterUsername">
            <Form.Label>Username</Form.Label>
              <Form.Control
                autoFocus
                type="name"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="RegisteEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted" style={{ fontSize: '0.6em' }}>
              We will not share your information with any third parties.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="RegisterPassword1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              autoFocus
              type="password"
              placeholder="Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="RegisterPassword2">
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-Entered Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="RegisterCheckbox">
            <Form.Check
              type="checkbox"
              value={tickbox} onChange={(e) => setTickbox(e.target.checked)}
              label="I agree to the Terms of Condition"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}
