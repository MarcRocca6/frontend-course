import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

SearchListings.propTypes = {
  getState: PropTypes.array,
  setStates: PropTypes.array,
  buttonFlag: PropTypes.array
};

export default function SearchListings (props) {
  // Helper Functions
  const Separator = styled('div')(
    ({ theme }) => `height: ${theme.spacing(3)};`,
  );
  function calculateValue (value) {
    return Math.round(2 ** (value / 10));
  }

  // Change Handles
  const handleChangePriceRange = (event, newValue) => {
    props.setStates[2](newValue);
  };
  const handleChangeCheckOut = (newValue) => {
    props.setStates[1](newValue);
  };
  const handleChangeCheckIn = (newValue) => {
    props.setStates[0](newValue);
  };
  const handleToggleButton = () => {
    if (props.buttonFlag[0] === 1) props.buttonFlag[1](0);
    else if (props.buttonFlag[0] === 0) props.buttonFlag[1](1);
  };

  return (
    <div className="container">
      <Container fluid className="p-3">
        <Row>
          <Col>
            <Row>
              <Col sm={3}>
                <Form>
                  <Row>
                    <Col>
                        <TextField
                          id="outlined-basic"
                          label="Location"
                          variant="outlined"
                          onChange={(e) => props.setStates[3](e.target.value)}
                        />
                    </Col>
                    <Col sm={3} style={searchCol}>
                      <button type="button" onClick={handleToggleButton} style={searchButton} className="searchButton align-top btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={searchIcon} className="searchIcon bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm={3}>
                <Form>
                  <Row>
                    <Col>
                        <TextField
                          id="outlined-basic"
                          label="Title"
                          variant="outlined"
                          onChange={(e) => props.setStates[4](e.target.value)}
                        />
                    </Col>
                    <Col sm={3} style={searchCol}>
                      <button type="button" onClick={handleToggleButton} style={searchButton} className="searchButton align-top btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={searchIcon} className="searchIcon bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm={3}>
                <Form>
                  <Row>
                    <Col>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              value={props.getState[0]}
                              label="From"
                              inputFormat="dd/MM/yyyy"
                              onChange={handleChangeCheckIn}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Stack>
                        </LocalizationProvider>
                    </Col>
                    <Col sm={3} style={searchCol}>
                      <button type="button" onClick={handleToggleButton} style={searchButton} className="searchButton align-top btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={searchIcon} className="searchIcon bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm={3}>
                <Form>
                  <Row>
                    <Col>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            value={props.getState[1]}
                            label="To"
                            inputFormat="dd/MM/yyyy"
                            onChange={handleChangeCheckOut}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Col>
                    <Col sm={3} style={searchCol}>
                      <button type="button" onClick={handleToggleButton} style={searchButton} className="searchButton align-top btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={searchIcon} className="searchIcon bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
        <Separator/>
        {/* <Row>
            <div id='priceHeading'>Price Range ($/night)</div>
        </Row> */}
        <Row >
          <Col sm="auto" className='align-self-center'>
            <div id='priceHeading'>Price Range</div>
            {/* <button type="button" style={searchButton} className="searchButton align-top btn btn-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={searchIcon} className="searchIcon bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button> */}
          </Col>
          <Col>
            <Separator/>
            <Box >
              <Typography id="non-linear-slider" gutterBottom>
                {/* {calculateValue(value[0])} {calculateValue(value[1])} */}
              </Typography>
              <PrettySlider
                aria-labelledby="non-linear-slider"
                getAriaValueText={calculateValue}
                defaultValue={[50, 100]}
                marks={marks}
                scale={calculateValue}
                onChange={handleChangePriceRange}
                min={50}
                step={1}
                max={100}
                valueLabelDisplay="auto"
              />
            </Box>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const PrettySlider = styled(Slider)({
  color: '#ffc107',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    color: '#f4be2e',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#f4be2e',
    border: '2px solid #f4be2e',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#757575',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const marks = [
  {
    value: 50,
    label: '$32',
  },
  {
    value: 75,
    label: '$181',
  },
  {
    value: 100,
    label: '$1024+',
  },
];

const searchCol =
  {
    paddingLeft: 0,
  }

const searchButton =
  {
    height: '100%',
  }

const searchIcon =
  {
    marginTop: -5,
  }
