/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./pages.css"

const Page3 = ({ props }) => {
  const numRows = 4; const numCols = 4;
  const pieces = {"square" : [[1,1], [1,1]],
                  "rectangle" : [[1], [1,1]],
                  "single" : [[1],[1]]}

  const [gameStatus, setGameStatus] = React.useState(0);
  const [gameActive, setGameActive] = React.useState(false);
  const [dynBlockCoords, setDynBlockCoords] = React.useState([0,0]);
  const [dynamicBoard, setDynamicBoard] = React.useState(getEmptyBoard());
  const [lockedBoard, setLockedBoard] = React.useState(getEmptyBoard());
  const [curBlock, setCurBlock] = React.useState(getRandomBlock());


  // ########################
  // ##### CREATE BOARD #####
  // ########################
  
  function getEmptyBoard() {
    return Array.from({length: numCols}, () => Array.from({length: numRows}, () => 0))
  }

  function resetGame() {
    setGameStatus(0)
    setDynBlockCoords([0,0])
    setDynamicBoard(getEmptyBoard())
    setLockedBoard(getEmptyBoard())
    setCurBlock(getRandomBlock())
  }

  React.useEffect(() => {
    if (isGameWon()) {
      alert("Success")
      resetGame()
    } else if (gameStatus === -1) {
      alert("Game Over")
      resetGame()
    }
  }, [lockedBoard, dynamicBoard])

  React.useEffect(() => {
    // Drops the dynamic block one row at a time
    function dropBlock() {
      const validMove = placeBlock(curBlock,dynBlockCoords)
      if (validMove) {
        const inc = dynBlockCoords[0]+1
        const newBlockCoords = [...dynBlockCoords]
        newBlockCoords[0] = inc
        setDynBlockCoords(newBlockCoords)
      } else {
        setLockedBoard(getCompleteBoard())
        setCurBlock(getRandomBlock())
        setDynBlockCoords([0,0])
      }
    }
    // Timer 
    const intervalId = setInterval(() => {
      if (gameActive) dropBlock();
    }, 100)
    return () => clearInterval(intervalId)
  }, [dynBlockCoords, dynamicBoard, gameActive])

  // Places block at any location on the dynamic board
  // Row and Col are the top left points of the block
  function placeBlock(block, coordinate) {
    const colIndex = coordinate[0]; const rowIndex = coordinate[1];
    let copy = getEmptyBoard();
    let bRows = block[0]; let bCols = block[1];
    for (let x=0; x < bRows.length; x++) {
      for (let y=0; y < bCols.length; y++) {
        if (colIndex+y >= numCols) return false
        else if (lockedBoard[colIndex+y][rowIndex+x] !== 0) {
          if (colIndex+y === 0) setGameStatus(-1)
          return false;
        } else {
          copy[colIndex+y][rowIndex+x] = 1;
        }
      }
    }
    setDynamicBoard(copy);
    return true;
  }

  function getRandomBlock() {
    const blockList = Object.values(pieces)
    const randomInt = Math.floor(Math.random() * Math.ceil(blockList.length));
    return blockList[randomInt]
  }

  function getCompleteBoard() {
    let board = Array.from({length: numCols}, () => Array.from({length: numRows}, () => 0));
    for (let c=0; c < numCols; c++) {
      let rowFilled = true;
      for (let r=0; r < numRows; r++) {
        if (lockedBoard[c][r] !== 0 || dynamicBoard[c][r] !== 0) {
          board[c][r] = 1
        } else rowFilled = false;
      }
      // If whole row filled set to 2
      if (rowFilled) {
        for (let r=0; r < numRows; r++) { 
          board[c][r] = 2
        }
      }
    }  
    return board;
  }

  function isGameWon() {
    let numRowsFilled = 0
    for (let c=0; c < numCols; c++) {
      let isRowFilled = true;
      for (let r=0; r < numRows; r++) {
        if (!(lockedBoard[c][r] !== 0 || dynamicBoard[c][r] !== 0)) {
          isRowFilled = false;
        }
      }
      if (isRowFilled) numRowsFilled += 1
    }
    if (numRowsFilled >= 2) return true
    else return false
  }

  // #########################
  // #### INPUTS TO BOARD ####
  // #########################


  React.useEffect(() => {
    let isListening = true;
    const listener = window.addEventListener('keydown', (event) => {
      if (isListening) {
        switch (event.key) {
          // case "ArrowUp":
          //     pressUp();
          //     break;
          // case "ArrowDown":
          //     pressDown();
          //     break;
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
  }, [dynBlockCoords, dynamicBoard]);

  function pressLeft() {
    const newBlockCoords = [...dynBlockCoords]
    const oldVal = newBlockCoords[1]
    if (oldVal - 1 >= 0) {
      newBlockCoords[1] = oldVal - 1
      setDynBlockCoords(newBlockCoords)
    }
  }
  function pressRight() {
    const newBlockCoords = [...dynBlockCoords]
    const oldVal = newBlockCoords[1]
    if (oldVal + curBlock[0].length + 1 <= numRows) {
      newBlockCoords[1] = oldVal + 1
      setDynBlockCoords(newBlockCoords)
    }
  }
  function clickedSquare() {
    setGameActive(true)
  }

  // #########################
  // ########## JSX ##########
  // #########################


  return (
    <div className="tetroMargin pageContent">
      <h1>Page3</h1>
      <Container className="tetroContainer">
        {getCompleteBoard().map((rows, rowIndex) => (
          <Row key={`Row${rowIndex}`} className="tetroRow" >
            {rows.map((cell, colIndex) => (
              <Col 
                key={`Cell${rowIndex}${colIndex}`} 
                className="square"
                onClick={(e) => clickedSquare()}
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
        >Reset</Button>
      </Container>
    </div>
  )
};

export default Page3;