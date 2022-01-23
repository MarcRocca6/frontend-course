import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Col from 'react-bootstrap/Col';

import PropTypes from 'prop-types';

const BookingRequests = ({ match }) => {
  // const history = useHistory();
  const { listingId } = match.params;
  const initListingData = {
    title: '',
    address: {},
    price: 0,
    thumbnail: '',
    reviews: [],
    owner: '',
    postedOn: '',
    published: true,
    metadata: { beds: 0, bathrooms: 0, bedrooms: 0, amenities: [], images: [], type: '' },
    availability: [[null, null]],
  }
  const [listingData, setListingData] = useState(initListingData);
  const [bookingData, setBookingData] = useState([]);
  const token = sessionStorage.userToken;
  // [days online, total profit, days booked this year]
  const [bookingFacts, setBookingFacts] = useState([0, 0, 0])

  function printDate (date) {
    const ndate = new Date(date)
    const ye = ndate.getFullYear()
    const mo = ndate.getMonth() + 1
    const da = ndate.getDate()
    return `${da}/${mo}/${ye}`
  }
  function handleAcceptDecline (e, index, accept) {
    e.preventDefault()
    let acceptDecline = 'decline'
    if (accept) acceptDecline = 'accept'
    fetch(`http://localhost:5005/bookings/${acceptDecline}/${bookingData[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            if (accept) {
              modalShow('Congratulations. You have succestfully accepted this booking')
              const newAvals = listingData.availability
              const checkIn = new Date(bookingData[index].dateRange[0])
              const checkOut = new Date(bookingData[index].dateRange[1])
              for (let i = 0; i < listingData.availability.length; i++) {
                const avalStart = new Date(listingData.availability[i][0])
                const avalEnd = new Date(listingData.availability[i][1])
                if (checkIn === avalStart) {
                  newAvals[i] = [checkOut, avalEnd]
                  break
                } else if (checkOut === avalEnd) {
                  newAvals[i] = [avalStart, checkIn]
                  break
                } else if (checkIn >= avalStart && checkOut <= avalEnd) {
                  newAvals[i] = [avalStart, checkIn]
                  newAvals.push([checkOut, avalEnd])
                  break
                }
              }
              const newListingData = listingData
              newListingData.availability = newAvals
              setListingData(newListingData)

              const detailPromise = fetch('http://localhost:5005/listings/unpublish/' + listingId, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                },
              })
              detailPromise.then((response) => {
                if (response.status === 400) console.log('Error.!');
                else if (response.status === 200) {
                  response.json().then((ndata) => {
                    const namePromises = () => new Promise((resolve, reject) => {
                      return fetch('http://localhost:5005/listings/publish/' + listingId, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + token,
                        },
                        body: JSON.stringify({ availability: newAvals })
                      }).then(nResponse => {
                        nResponse.json().then((data) => {
                          resolve()
                        });
                      });
                    });
                    namePromises().then(() => {});
                  });
                }
              });
            } else modalShow('You have succestfully declined this booking.')
          });
        } else {
          response.json().then((err) => {
            console.log(err);
            modalShow(err.error)
          });
        }
      })
  }

  const [showModal, setShowModal] = useState([false, '']);
  const modalClose = () => setShowModal([false, '']);
  const modalShow = (message) => setShowModal([true, message]);

  const defaultImgs = require('./../components/Listings/defaultImgs.json');
  function getThumbnail () {
    if (listingData.thumbnail === '') {
      return defaultImgs.ImageNotAvaliable
    } else return listingData.thumbnail
  }
  function getAdditionalImages () {
    if (listingData.metadata.images === undefined || listingData.metadata.images.length === 0) {
      return [[defaultImgs.ImageNotAvaliable, 1]]
    } else {
      const imgKey = []
      for (let i = 0; i < listingData.metadata.images.length; i++) {
        imgKey.push([listingData.metadata.images[i], i])
      }
      return imgKey
    }
  }

  React.useEffect(() => {
    // Get List of all Listings
    const detailPromise = fetch('http://localhost:5005/listings/' + listingId)
    detailPromise.then((response) => {
      if (response.status === 400) console.log('Error.!');
      else if (response.status === 200) {
        response.json().then((ndata) => {
          setListingData(ndata.listing)
          const daysOnline = Math.floor((new Date().getTime() - new Date(ndata.listing.postedOn).getTime()) / (1000 * 3600 * 24))
          // Get more information on each Listing
          const namePromises = () => new Promise((resolve, reject) => {
            return fetch('http://localhost:5005/bookings', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            }).then(nResponse => {
              nResponse.json().then((data) => {
                const thisYear = new Date().getFullYear();
                const relBookings = []
                let bookedDays = 0
                let totProfit = 0
                for (let i = 0; i < data.bookings.length; i++) {
                  if (data.bookings[i].listingId === listingId) {
                    relBookings.push(data.bookings[i])
                    if (data.bookings[i].status === 'accepted') {
                      totProfit += data.bookings[i].totalPrice
                      if (thisYear === new Date(data.bookings[i].dateRange[0]).getFullYear()) {
                        let endData = new Date(data.bookings[i].dateRange[1])
                        if (thisYear !== new Date(data.bookings[i].dateRange[1]).getFullYear()) {
                          endData = new Date(new Date().getFullYear(), 11, 31)
                        }
                        bookedDays += Math.floor((endData - new Date(data.bookings[i].dateRange[0])) / 86400000)
                      }
                    }
                  }
                }
                setBookingFacts([daysOnline, totProfit, bookedDays])
                setBookingData(relBookings)
                resolve()
              });
            });
          });
          namePromises().then(() => {});
        });
      }
    });
  }, [])

  return (
    <>
      <br></br>
      <h1 className="text-center padding-bottom-xl" >Book Listing</h1>
      <br></br>
      <div className='container'>
        <div className='row'>
          <div className='col-sm'>
            <div className="card text-black">
              <div className="card-body p-md-3">
                <Carousel>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={getThumbnail()}
                      alt="Thumbnail"
                    />
                    <Carousel.Caption>
                    </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
              </div>
            </div>
            <br></br>
            <div className="card text-black">
              <div className="card-body p-md-3">
              <Carousel>
                {getAdditionalImages().map((imageKey) => (
                  <Carousel.Item key={`carouselSlide${imageKey[1]}`}>
                    <img
                      className="d-block w-100"
                      src={imageKey[0]}
                      alt={`Listing Image ${imageKey[1]}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              </div>
            </div>
            <br></br>
            <div className="card text-black">
              <div className="card-body p-md-3">
                <strong className="text-center padding-bottom-xl" >Listing Avalabilities</strong>
                <br></br>
                {listingData.availability.map((times, index) => (
                  <div key={index}>
                    <small>{printDate(times[0])} - {printDate(times[1])}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-sm'>
            <div className="card text-black">
              <div className="card-body p-md-3">
                <TableContainer component={Paper}>
                  <Table sx={{ width: 'auto' }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left"><strong>Booking Information</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">
                          <Container>
                            <Row>
                              <small>Days been online: {bookingFacts[0]}</small>
                              <small>Profit this year: {bookingFacts[1]}</small>
                              <small>Days booked this year: {bookingFacts[2]}</small>
                            </Row>
                          </Container>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <br></br>

            <div className="card text-black">
              <div className="card-body p-md-3">
                <TableContainer component={Paper}>
                  <Table sx={{ width: 'auto' }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Booking Information</strong></TableCell>
                        <TableCell align="right"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookingData.map((booking, index) => (
                        <TableRow
                          key={`booking_${index}`}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="left">
                            <Container>
                              <Row>
                                  <small>Applicant: {booking.owner}</small>
                                  <small>Total Price: ${booking.totalPrice}</small>
                                  <small>Check in: {booking.dateRange[0].substring(0, 10)}</small>
                                  <small>Check out: {booking.dateRange[1].substring(0, 10)}</small>
                                  <small>Status: {booking.status}</small>
                              </Row>
                            </Container>
                          </TableCell>
                          <TableCell align="right">
                            {
                            (booking.status === 'pending') &&
                              <Container>
                                <Row>
                                  <Col>
                                    <Button
                                      className='reviewBookingsButton'
                                      type="submit"
                                      size="sm"
                                      variant="secondary"
                                      style = { { width: '120px', marginTop: '10px' } }
                                      onClick={(e) => handleAcceptDecline(e, index, true)}
                                    >
                                      Accept
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      className='reviewBookingsButton'
                                      type="submit"
                                      size="sm"
                                      variant="secondary"
                                      style = { { width: '120px', marginTop: '10px' } }
                                      onClick={(e) => handleAcceptDecline(e, index, false)}
                                    >
                                      Decline
                                    </Button>
                                  </Col>
                                </Row>
                              </Container>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <br></br>
          </div>
        </div>
      </div>

      <Modal show={showModal[0]} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Booking a Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>{showModal[1]}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
    </>
  )
};

export default BookingRequests;

BookingRequests.propTypes = {
  match: PropTypes.object,
};
