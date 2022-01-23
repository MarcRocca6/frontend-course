import React from 'react';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import "./pages.css"

const Home = ({ props }) => {

  const [gameCount, setGameCount] = React.useState(0);
  const [gameWon, setGameWon] = React.useState(0);

  React.useEffect(() => {
    let gamesRemain = localStorage.getItem('gamesRemain');
    if (gamesRemain === null) {
      fetch('http://cgi.cse.unsw.edu.au/~cs6080/21T3/data/remain.json')
      .then(response => response.json())
      .then(data => {
        gamesRemain = data.remain
        localStorage.setItem('gamesRemain', gamesRemain.toString());
        setGameCount(gamesRemain)
      });
    } else setGameCount(gamesRemain)

    let storage_gamesWon = localStorage.getItem('gamesWon');
    if (storage_gamesWon === null) {
      localStorage.setItem('gamesWon', '0');
      setGameWon(0)
    } else setGameWon(storage_gamesWon)
  }, [])

  function resetCount (e) {
    e.preventDefault()
    setGameWon(0)
    fetch('http://cgi.cse.unsw.edu.au/~cs6080/21T3/data/remain.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('gamesRemain', data.remain.toString());
      setGameCount(data.remain)
    });
  }

  return (
    <div className="pageContent">
      <Container>
        <Row >
          <Col className="dashBox">             
            <h1 className="home-text">{gameCount}</h1>
          </Col>
          <Col className="dashBox">    
            <h1 className="home-text">{gameWon}</h1>
          </Col>
        </Row >
        <Row >
          <Col className="dashBox">  
            {gameCount > 0 && <h1 className="home-text">Keep going</h1>}
            {gameCount <= 0 && <h1 className="home-text">Great job</h1>}
          </Col>
          <Col className="dashBox">      
            <Button 
              variant="secondary" 
              size="lg"
              className="dashButton"
              onClick={(e) => resetCount(e)}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
};

export default Home;


