import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import AuthContext from '../../AuthContext';

import Logo from './../../assets/logo.png';
import { BsFillPersonPlusFill, BsBoxArrowInRight, BsFillHouseFill } from 'react-icons/bs';
import { FaUmbrellaBeach } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBar = (props) => {
  const token = React.useContext(AuthContext);
  if (token == null || !token || token === 'undefined') return <NavLoggedOut />;
  else return <NavLoggedIn setAuth={props.setAuth}/>
}

export default NavBar;

const NavLoggedIn = (props) => {
  const history = useHistory()
  function logoutAction (e) {
    e.preventDefault()
    const token = sessionStorage.userToken;
    // const token = React.useContext(AuthContext);
    fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            sessionStorage.userToken = data.token;
            history.push('/');
            props.setAuth(null)
            sessionStorage.clear();
            localStorage.clear();
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
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link to="/" role="button" style={navTextLink}>
          <div style={navLogo}>
            <img style={navLogoImg} src={Logo}/>
            <div style={navLogoText}>airbrb</div>
          </div>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">

            <Link to="/createListing" role="button" style={navTextLink}>
              <BsFillHouseFill style={navIcon}/>
              <strong style={adjIcon}>Create Listings</strong>
            </Link>

            <Link to="/hostedListings" role="button" style={navTextLink}>
              <BsFillHouseFill style={navIcon}/>
              <strong style={adjIcon}>Hosted Listings</strong>
            </Link>

            <Link to="/allListings" role="button" style={navTextLink}>
              <FaUmbrellaBeach style={navIcon}/>
              <strong style={adjIcon}>All Listings</strong>
            </Link>

          </Nav>
          <Nav>

            {/* <Link to="/profile/1234" role="button" style={navTextLink}>
              <BsFillPersonPlusFill style={navIcon}/>
              <strong style={adjIcon}>Profile</strong>
            </Link> */}

            <Link to="/" onClick={(e) => logoutAction(e)} role="button" style={navTextLink}>
              <BsBoxArrowInRight style={navIcon}/>
              <strong style={adjIcon}>Logout</strong>
            </Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

NavLoggedIn.propTypes = {
  setAuth: PropTypes.func,
};

const NavLoggedOut = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link to="/" role="button" style={navTextLink}>
          <div style={navLogo}>
            <img style={navLogoImg} src={Logo}/>
            <div style={navLogoText}>airbrb</div>
          </div>
        </Link>
        <Link to="/allListings" role="button" style={navTextLink}>
          <FaUmbrellaBeach style={navIcon}/>
          <strong style={adjIcon}>All Listings</strong>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>

            <Link to="/login" role="button" style={navTextLink}>
              <BsBoxArrowInRight style={navIcon}/>
              <strong style={adjIcon}>Login</strong>
            </Link>

            <Link to="/register" role="button" style={navTextLink}>
              <BsFillPersonPlusFill style={navIcon}/>
              <strong style={adjIcon}>Register</strong>
            </Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const navLogo =
{
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const navIcon =
{
  color: 'rgba(255, 255, 255, 0.55)',
}
const adjIcon =
{
  paddingLeft: '5px',
  color: 'rgba(255, 255, 255, 0.55)',
  textDecoration: 'none',
  fontWeight: '400',
}
const navLogoImg =
{
  display: 'block',
  height: '25px',
  width: '25px',
  color: '#757575',
}
const navLogoText =
{
  paddingLeft: '5px',
  fontFamily: 'Typographica',
  fontSize: '1em',
  letterSpacing: '2px',
  color: '#e97075',
}

const navTextLink =
{
  paddingLeft: '15px',
  textDecoration: 'none',
}
