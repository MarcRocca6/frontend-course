import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

// import { BsFillHouseFill } from 'react-icons/bs';
// https://react-icons.github.io/react-icons

import { Link } from 'react-router-dom';
import Logo from './../../assets/logo.png';

import "./NavBar.css"

const largeNav = {height: "100px"}
const medNav = {height: "80px"}
const smallNav = {height: "60px"}

const NavBar = (props) => {
  const maxHeight = 1400
  const [windowDim, setWindowDim] = React.useState(getWindowDimensions());
  const [expandNav, setExpandNav] = React.useState(false);
  const [navHeightStyle, setNavHeightStyle] = React.useState(largeNav);


  /* Gets the Window Dimensions */
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height} = window;
    return { width, height };
  }
  
  /* Updates the Window Dimensions */
  React.useEffect(() => {
    function handleResize() {
      setWindowDim(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (windowDim.width >= maxHeight) setExpandNav(true)
    else setExpandNav(false)

    if (windowDim.width >= 1400) setNavHeightStyle(largeNav)
    else if (windowDim.width < 800) setNavHeightStyle(smallNav)
    else if (windowDim.width < 1400) setNavHeightStyle(medNav)
  }, [windowDim]);

  return (
    <Navbar bg="light" variant="light" className="navBar" style={navHeightStyle}>
      <Container className="navContainer" >

        <Nav className="col-sm">
          <Link to="/" role="button" className="navLogoLink">
            <img className="navLogoImg" src={Logo} alt="Logo"/> 
          </Link>
        </Nav>
        

        { expandNav
          ? 
          <>
            <Nav className="col-sm">
              <Link to="/dashboard" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Dashboard</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/math" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Math</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/connect" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Connect</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/memory" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Memorisation</div>
                </div> 
              </Link>
            </Nav>
          </>
          :

          <>
            <Nav className="col-sm">
              <Link to="/dashboard" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Da</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/math" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Ma</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/connect" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Me</div>
                </div> 
              </Link>
            </Nav>
            <Nav className="col-sm">
              <Link to="/game/memory" role="button" className="navLink">
                <div className="navIconLink"> 
                  {/* <BsFillHouseFill className="navIcon"/> */}
                  <div className="navLink">Co</div>
                </div> 
              </Link>
            </Nav>
          </>

        }
        
      </Container>
    </Navbar>
  );
}

export default NavBar;
