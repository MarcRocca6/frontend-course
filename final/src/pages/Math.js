import React from 'react';

import Button from 'react-bootstrap/Button';
import "./pages.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Page1 = ({ props }) => {

  const [answerVal, setAnswerVal] = React.useState(-99);
  const [inputVal, setInputVal] = React.useState(0);

  const [characterList, setCharacterList] = React.useState(getEquationList());

  function getEquationList() {
    const randNum1 = Math.floor(Math.random() * 50) + 1;
    const randNum2 = Math.floor(Math.random() * 50) + 1;
    const symList = ['+', '-', '*', '/', '%']
    const randSym1 = Math.floor(Math.random() * symList.length);
    return [randNum1, symList[randSym1], randNum2, '=']
  }

  function updateForm(value) {
    if (value !== null) {
      if (value === "") setInputVal("")
      else setInputVal(parseInt(value))
    }
  }
  React.useEffect(() => {
    if (characterList[1] === '+') {
      setAnswerVal(characterList[0] + characterList[2])
    } else if (characterList[1] === '*') {
      console.log(characterList[0], characterList[2])
      setAnswerVal(characterList[0] * characterList[2])
    } else if (characterList[1] === '/') {
      const divVal = (characterList[0] / characterList[2]);
      setAnswerVal(Math.round(divVal * 10) / 10);
    } else if (characterList[1] === '%') {
      setAnswerVal(characterList[0] % characterList[2])
    } else if (characterList[1] === '-') {
      setAnswerVal(characterList[0] - characterList[2])
    }
  }, [characterList])

  React.useEffect(() => {
    if (inputVal !== "" && answerVal === inputVal) {
      alert("Correct!")
      const gamesWon = parseInt(localStorage.getItem('gamesWon'));
      localStorage.setItem('gamesWon', `${gamesWon+1}`);
    }
  }, [inputVal, answerVal])


  function resetWord() {
    setCharacterList(getEquationList())
    setInputVal(0)
  }

  return (
    <div className="pageContentMath">
      <Container style={{margin: '0'}}>
        <Row style={{margin: '0', display: 'flex'}}>
          {characterList.map((letter, index) => (
            <Col key={`char${index}`} className="box">{letter}</Col>

          ))}
          <Col className="box">
            <input 
              className="boxInput" 
              type="number" 
              value={inputVal} 
              style={{display: 'flex'}}
              onInput={e => updateForm(e.target.value)}
            />
          </Col>  
        </Row > 
      </Container>
      <div className="smallBreak"></div>
      <Button 
        variant="secondary" 
        size="lg"
        onClick={(e) => resetWord()}
      >
        Reset
      </Button>
    </div>
  )
};

export default Page1;