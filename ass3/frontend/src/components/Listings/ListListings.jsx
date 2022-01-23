import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link } from 'react-router-dom';

LoginForm.propTypes = {
  getStates: PropTypes.array,
  buttonChange: PropTypes.number
};

export default function LoginForm (props) {
  const [listings, setListings] = React.useState([]);
  const [relListings, setRelListings] = React.useState([]);
  const defaultImgs = require('./defaultImgs.json');
  const userEmail = sessionStorage.userEmail;
  const token = sessionStorage.userToken;
  let relatedBookings = []

  function reorderList (dataList) {
    return dataList.sort(function (first, second) {
      return first.title.localeCompare(second.title);
    });
  }
  function reorderRelevantBookings (dataList) {
    if (token === undefined || token === null) return []
    relatedBookings = [...new Set(relatedBookings)];
    let relatedProperties = []
    for (let i = 0; i < relatedBookings.length; i++) {
      const isPresent = isInList(dataList, relatedBookings[i])
      if (isPresent[0] === true) {
        relatedProperties.push(isPresent[1])
      }
    }
    relatedProperties = reorderList(relatedProperties)
    return relatedProperties;
  }
  function isInList (propertyList, id) {
    for (let i = 0; i < propertyList.length; i++) {
      if (propertyList[i].id.toString() === id) {
        return [true, propertyList[i]]
      }
    }
    return [false, null, null]
  }

  // Limit the listings due to the searches
  function searchLimitList (dataList) {
    const limitedList = []
    let maxPrice = calculateValue(Math.max(...props.getStates[2]))
    if (maxPrice >= 1000) { maxPrice = maxPrice * 100 }
    let minPrice = calculateValue(Math.min(...props.getStates[2]))
    if (minPrice <= 35) { minPrice = 0 }
    dataList.forEach(function (item, index) {
      if (satisfiesSearchLimit(item, minPrice, maxPrice, props)) limitedList.push(dataList[index])
    });
    return limitedList
  }
  function isListingFree (item) {
    for (let i = 0; i < item.availability.length; i++) {
      if (item.availability[i].length !== 2) continue
      const avalStart = new Date(item.availability[i][0])
      const avalEnd = new Date(item.availability[i][1])
      if (avalStart === null || avalEnd === null) continue
      const checkIn = new Date(props.getStates[0])
      const checkOut = new Date(props.getStates[1])
      if (props.getStates[0] === null || props.getStates[1] === null ||
        (checkIn >= avalStart && checkOut <= avalEnd)) return true
    }
    return false
  }
  function calculateValue (value) { return Math.round(2 ** (value / 10)); }
  function satisfiesSearchLimit (item, minPrice, maxPrice, props) {
    if (isListingFree(item)) {
      // if (today === today) {
      if (parseInt(item.price) > minPrice && parseInt(item.price) < maxPrice) {
        // If no Title and no Location
        if ((props.getStates[4] === '' || item.title === undefined) &&
          (props.getStates[3] === '' || item.address === undefined)) return true
        // If no Title but there is a Location
        else if ((props.getStates[4] === '' || item.title === undefined) &&
        (item.address.toLowerCase().indexOf(props.getStates[3].toLowerCase()) !== -1)) return true
        // If no Location but there is a Title
        else if ((props.getStates[3] === '' || item.address === undefined) &&
        (item.title.toLowerCase().indexOf(props.getStates[4].toLowerCase()) !== -1)) return true
        // If there is both a location and a title
        else if ((item.address.toLowerCase().indexOf(props.getStates[3].toLowerCase()) !== -1) &&
        (item.title.toLowerCase().indexOf(props.getStates[4].toLowerCase()) !== -1)) return true
      }
    }
    // }
    return false
  }

  React.useEffect(() => {
    // Get List of all Listings
    if (token === undefined || token === null) {
      const detailPromise = fetch('http://localhost:5005/listings')
      detailPromise.then((response) => {
        if (response.status === 400) console.log('Error.!');
        else if (response.status === 200) {
          response.json().then((data) => {
            // Just get IDs of users hosted listings
            const listingList = data.listings;
            const detailedListings = []
            let i = 0;
            // Get more information on each Listing
            const namePromises = () => new Promise((resolve, reject) => {
              return fetch('http://localhost:5005/listings/' + listingList[i].id).then(nResponse => {
                nResponse.json().then((nData) => {
                  if (i === listingList.length - 1) {
                    // Pass the listings to the JSX to render
                    detailedListings.push(nData.listing)
                    const searchLimit = searchLimitList(detailedListings)
                    const ordered = reorderList(searchLimit)
                    const relBookings = reorderRelevantBookings(ordered)
                    setRelListings(relBookings)
                    setListings(ordered)
                    resolve(i);
                  } else {
                    const listingInfo = nData.listing
                    listingInfo.id = listingList[i].id
                    detailedListings.push(listingInfo)
                    i++;
                    resolve(namePromises());
                  }
                });
              });
            });
            namePromises().then(() => {});
          });
        }
      });
    } else {
      const bookingPromise = fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      bookingPromise.then((response) => {
        if (!response.ok) {
          response.json().then((err) => {
            console.log(err);
            alert(err.error);
          });
        } else if (response.status === 200) {
          response.json().then((bookData) => {
            for (let ii = 0; ii < bookData.bookings.length; ii++) {
              if (userEmail === bookData.bookings[ii].owner) {
                relatedBookings.push(bookData.bookings[ii].listingId)
              }
            }
            const detailPromise = fetch('http://localhost:5005/listings')
            detailPromise.then((response) => {
              if (response.status === 400) console.log('Error.!');
              else if (response.status === 200) {
                response.json().then((data) => {
                  // Just get IDs of users hosted listings
                  const listingList = data.listings;
                  const detailedListings = []
                  let i = 0;
                  // Get more information on each Listing
                  const namePromises = () => new Promise((resolve, reject) => {
                    return fetch('http://localhost:5005/listings/' + listingList[i].id).then(nResponse => {
                      nResponse.json().then((nData) => {
                        if (i === listingList.length - 1) {
                          // Pass the listings to the JSX to render
                          // console.log(detailedListings)
                          detailedListings.push(nData.listing)
                          const searchLimit = searchLimitList(detailedListings)
                          const ordered = reorderList(searchLimit)
                          const relBookings = reorderRelevantBookings(ordered)
                          setRelListings(relBookings)
                          setListings(ordered)
                          resolve(i);
                        } else {
                          const listingInfo = nData.listing
                          listingInfo.id = listingList[i].id
                          detailedListings.push(listingInfo)
                          i++;
                          resolve(namePromises());
                        }
                      });
                    });
                  });
                  namePromises().then(() => {});
                });
              }
            });
          });
        }
      });
    }
  }, [props.buttonChange, props.getStates[2]])

  return (
    <>
      <div className="container">
        <br></br>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Thumbnail (Booked Listings)</strong></TableCell>
                <TableCell align="right"><strong>Hosting Information</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relListings.map((listing) => (
                <TableRow
                  key={listing.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link to={'/viewListing/' + listing.id} role="button">
                      { listing.thumbnail === ''
                        ? <img src={defaultImgs.ImageNotAvaliable} width='200' alt="Image Not Avaliable" />
                        : <img src={listing.thumbnail} width='200' alt="Listed House Image" />
                      }
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    <Container>
                      <Row>
                        <Col>
                          <Link to={'/viewListing/' + listing.id} role="button">
                            <strong>{listing.title}</strong>
                          </Link>
                        </Col>
                      </Row>
                      <br></br>
                      <Row>
                        <Col>Price $ {listing.price}</Col>
                      </Row>
                      <Row>
                        <Col>Number of Reviews: {listing.reviews.length}</Col>
                      </Row>
                      <Row>
                        <Col>Address: {listing.address}</Col>
                      </Row>
                    </Container>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>
        <br></br>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Thumbnail (All Listings)</strong></TableCell>
                <TableCell align="right"><strong>Hosting Information</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map((listing) => (
                <TableRow
                  key={listing.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link to={'/viewListing/' + listing.id} role="button">
                      { listing.thumbnail === ''
                        ? <img src={defaultImgs.ImageNotAvaliable} width='200' alt="Image Not Avaliable" />
                        : <img src={listing.thumbnail} width='200' alt="Listed House Image" />
                      }
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    <Container>
                      <Row>
                        <Col>
                          <Link to={'/viewListing/' + listing.id} role="button">
                            <strong>{listing.title}</strong>
                          </Link>
                        </Col>
                      </Row>
                      <br></br>
                      <Row>
                        <Col>Price $ {listing.price}</Col>
                      </Row>
                      <Row>
                        <Col>Number of Reviews: {listing.reviews.length}</Col>
                      </Row>
                      <Row>
                        <Col>Address: {listing.address}</Col>
                      </Row>
                    </Container>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
