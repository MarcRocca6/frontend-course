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

  const numRows = 7; 
  const numCols = 9;

  /* The first value must be the top-left corner of the piece */
  const pieceTypes = {"square" : [[0,0], [0,1], [1,0], [1,1]],
                      "rectangle" : [[0,0], [1,0]],
                      "single" : [[0,0]],
                      "T" : [[0,0], [1,0], [2,0], [1,1]],
                    }

  const [gameStatus, setGameStatus] = React.useState(0);
  const [gameActive, setGameActive] = React.useState(false);

  const [dynamicPieces, setDynPieces] = React.useState({});
  const [dynBlockCoords, setDynBlockCoords] = React.useState([0,0]);
  const [dynamicBoard, setDynamicBoard] = React.useState(getEmptyBoard());
  const [staticBoard, setStaticBoard] = React.useState(populatedBoard([[5,5]]));

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
  }, [staticBoard, dynamicBoard])

  function isGameWon() {
    return false;
  }

  React.useEffect(() => {
    // Performs the next turn
    function nextTurn() {
      const validMove = true
      if (validMove) {
        
      } else {
        
      }
    }
    // Timer 
    const intervalId = setInterval(() => {
      if (gameActive) nextTurn();
    }, 100)
    return () => clearInterval(intervalId)
  }, [dynBlockCoords, dynamicBoard, gameActive])

  /**
   * Places blocks at any location on the dynamic board
   * @param {list} block Array of coordinates that represents the block
   * @param {coordinate} coordinate The top left coordinate of the block
   * @return {boolean} true if valid move, false if not
   */
  function placeRelBlock(blockName, relCoord) {
    let copy = getEmptyBoard();
    let copyDynamicPieces = Object.assign(dynamicPieces);
    let block = [...copyDynamicPieces[blockName]];
    for (let i=0; i < block.length; i++) {
      const cell = addCoords(block[i], relCoord);
      // If block out of range of map then INVALID
      if (cell[0] >= numCols || cell[0] < 0) return false
      else if (cell[1] >= numRows || cell[1] < 0) return false
      // If that new block is already occupied
      else if (getStaticBoardVal(cell) !== 0) {
        return false;
      // If that new block is NOT occupied
      } else {
        block[i] = cell
        copy[cell[0]][cell[1]] = 1;
      }
    }
    // Update the new coords of the dynamic pieces
    copyDynamicPieces[blockName] = block;
    setDynPieces(copyDynamicPieces)
    // Update the digital board
    setDynamicBoard(copy);
    return true;
  }

  // #########################
  // #### INPUTS TO BOARD ####
  // #########################


  React.useEffect(() => {
    let isListening = true;
    const listener = window.addEventListener('keydown', (event) => {
      if (isListening && gameActive) {
        switch (event.key) {
          case "ArrowUp":
              pressUp();
              break;
          case "ArrowDown":
              pressDown();
              break;
          case "ArrowLeft":
              pressLeft();
              break;
          case "ArrowRight":
              pressRight();
              break;
          default: break;
        }
      }
    });
    return () => {
      isListening = false;
      window.removeEventListener('keydown', listener);
    }
  }, [dynBlockCoords, dynamicBoard, gameActive]);

  function pressUp() {
    console.log("UP")
    if (! placeRelBlock("piece1", [-1,0])) {
      console.log("Invalid Move")
    }
  }
  function pressDown() {
    console.log("DOWN")
    if (! placeRelBlock("piece1", [1,0])) {
      console.log("Invalid Move")
    }
  }
  function pressLeft() {
    console.log("LEFT")
    if (! placeRelBlock("piece1", [0,-1])) {
      console.log("Invalid Move")
    }
  }
  function pressRight() {
    console.log("RIGHT")
    if (! placeRelBlock("piece1", [0,1])) {
      console.log("Invalid Move")
    }
  }
  function clickedSquare(colIndex, rowIndex) {
    console.log("Pressed ", colIndex, rowIndex)
    setGameActive(true)
    dynamicPieces["piece1"] = pieceTypes['T']
  }

  // ###################$$$$#####
  // ##### HELPER FUNCTIONS #####
  // ##################$$$$######


  function getEmptyBoard() {
    return Array.from({length: numCols}, 
      () => Array.from({length: numRows}, () => 0))
  }

  function populatedBoard(coordList) {
    let board = getEmptyBoard()
    for (let i = 0; i < coordList.length; i++ ) {
      board[coordList[i][0]][coordList[i][1]] = 2;
    }
    return board;
  }

  function getBoard() {
    let board = getEmptyBoard();
    for (let c=0; c < numCols; c++) {
      for (let r=0; r < numRows; r++) {
        if (staticBoard[c][r] !== 0) {
          board[c][r] = staticBoard[c][r]
        } else if (dynamicBoard[c][r] !== 0) {
          board[c][r] = dynamicBoard[c][r]
        } 
      }
    }  
    return board;
  }

  function getStaticBoardVal(coord) {
    return staticBoard[coord[0]][coord[1]]
  }

  function getDynamicBoardVal(coord) {
    return dynamicBoard[coord[0]][coord[1]]
  }

  function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.ceil(max));
  }

  function addCoords(c1, c2) {
    return [c1[0]+c2[0], c1[1]+c2[1]]
  }

  function resetGame() {
    setGameStatus(0)
    setGameActive(false)
    setDynBlockCoords([0,0])
    setDynamicBoard(getEmptyBoard())
    setStaticBoard(getEmptyBoard())
  }


  // #########################
  // ########## JSX ##########
  // #########################


  return (
    <div className="tetroMargin pageContent">
      <h1>Page4</h1>
      <Container className="tetroContainer">

        {getBoard().map((rows, rowIndex) => (
          <Row key={`Row${rowIndex}`} className="tetroRow" >
            {rows.map((cell, colIndex) => (
              <Col 
                key={`Cell${rowIndex}${colIndex}`} 
                className="tetroCol"
                onClick={(e) => clickedSquare(colIndex, rowIndex)}
              >
                {cell === 2 && <div className="green"></div>}
                {cell === 1 && <div className="red"></div>}
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