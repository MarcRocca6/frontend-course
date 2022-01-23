/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./pages.css"


const Page4 = ({ props }) => {
    
  // #########################
  // ##### INITALISATION #####
  // #########################

  const numRows = 10; 
  const numCols = 10;

  const [gameStatus, setGameStatus] = React.useState(0);
  const [turn, setTurn] = React.useState(1);
  const [staticBoard, setStaticBoard] = React.useState(getEmptyBoard());

  // ########################
  // ##### CREATE BOARD #####
  // ########################

  React.useEffect(() => {
    if (isGameWon()) {
      alert("Success")
      resetGame()
    } else if (gameStatus === -1) {
      alert("Game Over")
      resetGame()
    }
  }, [staticBoard])


  function isLine(z,x,c,v) { return ((z!==0)&&(z===x)&&(z===c)&&(z===v)) }
  function isGameWon() {
    console.log(staticBoard)

    for (let x = 0; x < numRows-3; x++) {
        for (let y = 0; y < numCols; y++) {
            if (isLine(staticBoard[x][y], staticBoard[x+1][y], staticBoard[x+2][y], staticBoard[x+3][y])) {
                return true;
            }
        }
    }
    for (let x = 0; x < numRows; x++) {
      for (let y = 0; y < numCols-2; y++) {
          if (isLine(staticBoard[x][y], staticBoard[x][y+1], staticBoard[x][y+2], staticBoard[x][y+3])) {
              return true;
          }
      }
    }
    for (let x = 3; x < numRows; x++) {
      for (let y = 0; y < numCols-3; y++) {
          if (isLine(staticBoard[x][y], staticBoard[x-1][y+1], staticBoard[x-2][y+2], staticBoard[x-3][y+3])) {
              return true;
          }
      }
    }
    for (let x = 0; x < numRows-3; x++) {
      for (let y = 0; y < numCols-3; y++) {
          if (isLine(staticBoard[x][y], staticBoard[x+1][y+1], staticBoard[x+2][y+2], staticBoard[x+3][y+3])) {
              return true;
          }
      }
    }
    return false

  }


  // #########################
  // #### INPUTS TO BOARD ####
  // #########################


  function clickedSquare(colIndex, rowIndex) {
    console.log(colIndex, rowIndex)
    let flag = false;

    let copy = [];
    for (var i = 0; i < staticBoard.length; i++)
      copy[i] = staticBoard[i].slice();

    for (let i =0; i < numCols ; i++) {
      if (staticBoard[i][colIndex] !== 0) {
        copy[i-1][colIndex] = turn
        flag = true
        break;
      }
    }
    if (flag === false) {
      console.log("A", colIndex, rowIndex)
      copy[numRows-1][colIndex] = turn
    }
    setStaticBoard(copy)
    if (turn === 1) setTurn(2)
    else setTurn(1)
  }

  // ###################$$$$#####
  // ##### HELPER FUNCTIONS #####
  // ##################$$$$######


  function getEmptyBoard() {
    return Array.from({length: numCols}, 
      () => Array.from({length: numRows}, () => 0))
  }

  function resetGame() {
    setGameStatus(0)
    setTurn(1)
    setStaticBoard(getEmptyBoard())
  }


  // #########################
  // ########## JSX ##########
  // #########################


  return (
    <div className="tetroMargin pageContent">
      <Container className="tetroContainer">

        {staticBoard.map((rows, rowIndex) => (
          <Row key={`Row${rowIndex}`} className="tetroRow" >
            {rows.map((cell, colIndex) => (
              <Col 
                key={`Cell${rowIndex}${colIndex}`} 
                className="tetroCol"
                onClick={(e) => clickedSquare(colIndex, rowIndex)}
              >
                {cell === 2 && <div className="player2"></div>}
                {cell === 1 && <div className="player1"></div>}
                {cell === 0 && <div className="grey"></div>}
              </Col>
            ))}
          </Row>
        ))}

        <Button 
          style={{'marginTop': '20px'}}
          variant="success"
          size="lg"
          onClick={(e) => resetGame()}
        >Reset
        </Button>

      </Container>
    </div>
  )
};

export default Page4;