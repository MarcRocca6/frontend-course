import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';

import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';

import { MdBathroom, MdBedroomParent } from 'react-icons/md';
import { RiHotelBedFill } from 'react-icons/ri';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link } from 'react-router-dom';

export default function LoginForm (props) {
  const token = sessionStorage.userToken;
  const userEmail = sessionStorage.userEmail;
  const [listings, setListings] = React.useState([]);
  const defaultImgs = require('./defaultImgs.json');
  const [dateRange] = React.useState([]);
  const [deleteFlag, setDeleteFlag] = React.useState(true);

  // handle input change
  const handleDateChange = (newValue, index) => {
    const listingsList = [...listings];
    listingsList[index].availability = [newValue];
    setListings(listingsList);
  };

  function handlePublish (event, index) {
    event.preventDefault()
    if (listings[index].availability[0][0] == null || listings[index].availability[0][1] == null) {
      alert('Please fill in both date fields')
    } else {
      fetch('http://localhost:5005/listings/publish/' + listings[index].id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          availability: listings[index].availability,
        })
      })
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              const listingsList = [...listings];
              listingsList[index].published = false;
              setListings(listingsList);
            });
          } else {
            response.json().then((err) => {
              console.log(err);
              alert(err.error);
            });
          }
        })
    }
  }
  function deleteListing (event, index) {
    if (listings[index] === undefined) {
      alert('This listing has already been deleted')
    } else {
      fetch('http://localhost:5005/listings/' + listings[index].id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(response => {
          if (!response.ok) {
            response.json().then((err) => {
              console.log(err);
              alert(err.error);
            });
          } else {
            const listingCopy = listings
            let endIndex = index
            if (endIndex === 0) endIndex = 1
            listingCopy.splice(index, endIndex)
            setListings(listingCopy)
            setDeleteFlag(!deleteFlag)
          }
        })
    }
  }
  function handleUnpublish (event, index) {
    event.preventDefault()
    fetch('http://localhost:5005/listings/unpublish/' + listings[index].id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        if (!response.ok) {
          response.json().then((err) => {
            console.log(err);
            alert(err.error);
          });
        } else {
          const listingsList = [...listings];
          listingsList[index].published = true;
          listingsList[index].availability = [[null, null]];
          setListings(listingsList);
        }
      })
  }
  function alphabeticalListing (dataList) {
    return dataList.sort(function (first, second) {
      return first.title.localeCompare(second.title);
    });
  }
  function getHostedIDs (dataList) {
    const hostedListings = []
    dataList.forEach(function (item, index) {
      if (item.owner === userEmail) { hostedListings.push(item.id) }
    });
    return hostedListings
  }
  function getRating (reviews) {
    let numValidReviews = 0
    let totNumRatings = 0
    for (let i = 0; i < reviews.length; i++) {
      const curReview = reviews[i]
      if (curReview.rating === undefined) continue
      else {
        numValidReviews += 1
        totNumRatings += curReview.rating
      }
    }
    return Math.floor(totNumRatings / numValidReviews)
  }

  React.useEffect(() => {
    // Get List of all Listings
    const detailPromise = fetch('http://localhost:5005/listings')
    detailPromise.then((response) => {
      if (response.status === 400) console.log('Error.!');
      else if (response.status === 200) {
        response.json().then((data) => {
          // Just get IDs of users hosted listings
          const alphaListing = alphabeticalListing(data.listings);
          const listingIds = getHostedIDs(alphaListing);
          // console.log(`Num of Hosted Listings: ${listingIds.length}`)
          const detailedListings = []
          let i = 0;
          // Get more information on each Listing
          const namePromises = () => new Promise((resolve, reject) => {
            return fetch('http://localhost:5005/listings/' + listingIds[i]).then(nResponse => {
              nResponse.json().then((nData) => {
                if (i === listingIds.length) {
                  setListings(detailedListings)
                  resolve(i);
                } else {
                  const listingData = nData.listing
                  listingData.id = listingIds[i]
                  if (listingData.availability[0] === undefined || listingData.availability[0][0] === undefined) {
                    listingData.availability = [[null, null]]
                    listingData.published = true
                  } else { listingData.published = false }
                  detailedListings.push(listingData)
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
  }, [dateRange, deleteFlag])

  return (
    <>
      <div className="text-black">
        <div className='container'>
          <TableContainer style={ { width: 'auto' } } component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Thumbnail</strong></TableCell>
                  <TableCell align="right"><strong>Hosting Information</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((listing, index) => (
                  <TableRow
                    key={listing.title}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link to={'/editListing/' + listing.id} role="button">
                        { listing.thumbnail === ''
                          ? <img src={defaultImgs.ImageNotAvaliable} style={hostingImage} alt="Image Not Avaliable" />
                          : <img src={listing.thumbnail} style={hostingImage} alt="Listed House Image" />
                        }
                      </Link>
                    </TableCell>
                    <TableCell align="right" style={hostingTable}>
                      <Container align="right">
                        <Row align="right" style={ { paddingTop: '10px' } }>
                          <Col>
                            <Link to={'/editListing/' + listing.id} role="button" style={hostingTitleLink}>
                              <strong style={hostingTitle}>{listing.title}</strong>
                            </Link>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Rating
                              name="Listing Rating"
                              value={getRating(listing.reviews)}
                              size="medium" readOnly
                              style={ { verticalAlign: 'middle' } }
                              />
                            <small>({listing.reviews.length})</small>
                          </Col>
                        </Row>
                        <br></br>
                        <Row>
                          <Col><small>$ {listing.price}/night</small></Col>
                        </Row>
                        {listing.metadata.propertyType !== undefined &&
                          <Row>
                            <Col>
                              <small>{listing.metadata.propertyType}</small>
                            </Col>
                          </Row>
                        }
                        <Row>
                          <Col><small>{listing.address}</small></Col>
                        </Row>
                        {!(listing.metadata.amenities === undefined ||
                        listing.metadata.amenities.length === 0) &&
                          <Row>
                            <Col>
                              <small>{listing.metadata.amenities.toString().replace(/,/g, ', ')}</small>
                            </Col>
                          </Row>
                        }
                        {
                        (listing.metadata.beds !== undefined ||
                        listing.metadata.bedrooms !== undefined ||
                        listing.metadata.bathrooms !== undefined) &&
                          <Row>
                            <Col>
                              {listing.metadata.beds !== undefined &&
                                <small><RiHotelBedFill alt="Beds"/>x{listing.metadata.beds}&nbsp;&nbsp;</small>
                              }
                              {listing.metadata.bedrooms !== undefined &&
                                <small><MdBedroomParent alt="Bedrooms"/>x{listing.metadata.bedrooms}&nbsp;&nbsp;</small>
                              }
                              {listing.metadata.bathrooms !== undefined &&
                                <small><MdBathroom alt="Bathrooms"/>x{listing.metadata.bathrooms}&nbsp;&nbsp;</small>
                              }
                            </Col>
                          </Row>
                        }
                        <Row>
                          <Col style={dateRangeBox}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                  label="Advanced keyboard"
                                  value={[listing.availability[0][0], listing.availability.slice(-1)[0][1]]}
                                  inputFormat="dd/MM/yyyy"
                                  onChange={(newValue) => handleDateChange(newValue, index)}
                                  InputAdornmentProps={{ position: 'end' }}
                                  renderInput={(startProps, endProps) => (
                                    <React.Fragment>
                                      <Box sx={{ mx: 1 }} style={ { flex: '1' } }></Box>
                                      <input style={dateRangeStyle} ref={startProps.inputRef} {...startProps.inputProps} />
                                      <Box sx={{ mx: 1 }}><small>&nbsp;to&nbsp;</small></Box>
                                      <input style={dateRangeStyle} ref={endProps.inputRef} {...endProps.inputProps} />
                                    </React.Fragment>
                                  )}
                                />
                              </LocalizationProvider>
                          </Col>
                        </Row>
                        {(listing.published)
                          ? <Row>
                            <Col>
                              <Button
                                size="sm" type="submit"
                                variant="secondary" onClick={(e) => handlePublish(e, index)}
                                style = { { width: '170px', marginTop: '10px', fontSize: '90%' } }
                              >
                                Publish Listing
                              </Button>
                            </Col>
                          </Row>
                          : <Row>
                            <Col>
                              <Button
                                className='unpublishButton' size="sm"
                                type="submit" variant="secondary"
                                onClick={(e) => handleUnpublish(e, index)}
                                style = { { width: '170px', marginTop: '10px', fontSize: '90%' } }
                              >
                                Unpublish Listing
                              </Button>
                            </Col>
                          </Row>
                        }
                        <Row>
                          <Col>
                            <Button
                              className='reviewBookingsButton' size="sm"
                              type="submit" variant="secondary"
                              onClick={(e) => deleteListing(e, index)}
                              style = { { width: '170px', marginTop: '10px', fontSize: '90%' } }
                            >
                              Delete Listing
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                              <Link to={'/bookingRequests/' + listing.id} role="button" style={hostingTitleLink}>
                                <Button
                                  className='reviewBookingsButton' size="sm"
                                  type="submit" variant="secondary"
                                  style = { { width: '170px', marginTop: '10px', fontSize: '90%' } }
                                >
                                  Booking Requests
                                </Button>
                              </Link>
                          </Col>
                        </Row>
                        <br></br>
                      </Container>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  )
}

const hostingImage =
  {
    width: '100%',
  }

const hostingTitle =
  {
    color: 'black',
    fontStyle: 'italic',
    textDecoration: 'none',
    textDecorationColor: 'black',
  }

const hostingTitleLink =
  {
    textDecorationColor: 'black',
  }

const dateRangeStyle =
  {
    width: 70,
    fontSize: 12,
    border: '1px solid #000',
  }

const dateRangeBox =
  {
    paddingTop: 10,
    paddingBottom: 10,
  }

const hostingTable =
  {
    width: '50%',
    paddingTop: 10,
    paddingBottom: 10,
  }
