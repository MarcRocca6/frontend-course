import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Rating from '@mui/material/Rating';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

// import { useHistory } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

const ViewListing = ({ match }) => {
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
  const [dateRange, setDateRange] = useState([null, null]);
  const token = sessionStorage.userToken;
  const userEmail = sessionStorage.userEmail;
  const [ratingHover, setRatingHover] = React.useState(false);
  const [bookingId, setBookingId] = React.useState(0);
  const [reviewSubmittedFlag, setReviewSubmitFlag] = React.useState(false)

  const [inputReviewText, setInputReviewText] = useState('')
  const [inputReviewRating, setInputReviewRating] = useState(0)

  const [showModal, setShowModal] = useState([false, '']);
  const modalClose = () => setShowModal([false, '']);
  const modalShow = (message) => setShowModal([true, message]);

  const [showReviewModal, setReviewShowModal] = useState(false);
  const modalReviewClose = () => setReviewShowModal(false);
  const modalReviewShow = () => setReviewShowModal(true);

  const [showLeaveReviewModal, setLeaveReviewShowModal] = useState(false);
  const modalLeaveReviewClose = () => setLeaveReviewShowModal(false);
  const modalLeaveReviewShow = () => {
    setLeaveReviewShowModal(true);
  }

  function submitReview (e) {
    modalLeaveReviewClose()
    fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        review: { rating: inputReviewRating, comment: inputReviewText },
      })
    })
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            setReviewSubmitFlag(!reviewSubmittedFlag)
          });
        } else {
          response.json().then((err) => {
            console.log(err);
            modalShow(err.error)
          });
        }
      })
  }
  function deleteBooking (e) {
    e.preventDefault()
    const detailPromise = fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    detailPromise.then((response) => {
      if (response.status === 400) console.log('Error.!');
      else if (response.status === 200) {
        response.json().then((data) => {
          // Just get IDs of users hosted listings
          let deleteId = null
          let bookingPeriod = null
          let flag = 4;
          for (let i = 0; i < data.bookings.length; i++) {
            if (data.bookings[i].listingId === listingId) {
              if (data.bookings[i].owner === userEmail) {
                flag = 1
                deleteId = data.bookings[i].id
                bookingPeriod = data.bookings[i].dateRange
                break
              } else if (flag > 3) flag = 3
            }
          }
          if (flag >= 3) modalShow('You have not made any bookings for this listing.')
          else if (flag <= 2) {
            // Get more information on each Listing
            const namePromises = () => new Promise((resolve, reject) => {
              return fetch('http://localhost:5005/bookings/' + deleteId, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                },
              }).then(nResponse => {
                nResponse.json().then((nData) => {
                  console.log(nData)
                  const dateString = `${printDate(bookingPeriod[0])} - ${printDate(bookingPeriod[1])}`
                  modalShow(`Your booking for ${dateString} has been delete`)
                });
              });
            });
            namePromises().then(() => {});
          }
        });
      }
    });
  }
  function printDate (date) {
    const ndate = new Date(date)
    const ye = ndate.getFullYear()
    const mo = ndate.getMonth() + 1
    const da = ndate.getDate()
    return `${da}/${mo}/${ye}`
  }
  function isListingFree () {
    for (let i = 0; i < listingData.availability.length; i++) {
      const avalStart = new Date(listingData.availability[i][0])
      const avalEnd = new Date(listingData.availability[i][1])
      const checkIn = new Date(dateRange[0])
      const checkOut = new Date(dateRange[1])
      if (checkIn >= avalStart && checkOut <= avalEnd) return true
    }
    return false
  }
  function canUserReview (e) {
    e.preventDefault()
    fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(nResponse => {
      nResponse.json().then((data) => {
        let flag = 4;
        for (let i = 0; i < data.bookings.length; i++) {
          if (data.bookings[i].listingId === listingId) {
            if (data.bookings[i].owner === userEmail) {
              if (data.bookings[i].status === 'accepted') {
                flag = 1
                setBookingId(data.bookings[i].id)
                break
              } else flag = 2
            } else if (flag > 3) flag = 3
          }
        }
        if (flag >= 3) modalShow('You must make a booking request & have it accepted before you can leave a review')
        else if (flag === 2) modalShow('Your booking request needs to be accepted before you can leave a review')
        else if (flag === 1) modalLeaveReviewShow()
        else modalShow('Error.')
      });
    });
  }
  function getAvgRating () {
    let numValidReviews = 0
    let totNumRatings = 0
    for (let i = 0; i < listingData.reviews.length; i++) {
      const curReview = listingData.reviews[i]
      if (curReview.rating === undefined) continue
      else {
        numValidReviews += 1
        totNumRatings += curReview.rating
      }
    }
    return Math.floor(totNumRatings / numValidReviews)
  }
  function handleSubmit (event) {
    event.preventDefault()
    const checkIn = new Date(dateRange[0])
    const checkOut = new Date(dateRange[1])
    if (isListingFree()) {
      const numDays = Math.floor((checkOut - checkIn) / 86400000);
      const price = numDays * listingData.price;
      fetch('http://localhost:5005/bookings/new/' + listingId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          dateRange: [checkIn, checkOut],
          totalPrice: price,
        })
      })
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data)
              modalShow('You have succestfully booked this listing')
            });
          } else {
            response.json().then((err) => {
              console.log(err);
              modalShow(err.error)
            });
          }
        })
    } else {
      modalShow('Sorry. This booking is not avaliable during your selected time frame.')
    }
  }

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
    fetch('http://localhost:5005/listings/' + listingId)
      .then(response => response.json())
      .then(data => {
        setListingData(data.listing)
      });
  }, [reviewSubmittedFlag])
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
          <br></br>
          <div className='col-sm'>
            <div className="card text-black">
              <div className="card-body p-md-3">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                      <Form.Control
                        readOnly
                        disabled
                        autoFocus
                        type="name"
                        placeholder=""
                        value={listingData.title}
                        // onChange={(e) => setTitle(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Property Type</Form.Label>
                    <Form.Select
                      readOnly
                      disabled
                      value={listingData.metadata.type}
                      // onChange={e => setPropertyType(e.target.value)}
                    >
                      <option>House</option>
                      <option>Villa</option>
                      <option>Town House</option>
                      <option>Pent House</option>
                      <option>Tent</option>
                      <option>Mansion</option>
                      <option>Appartment</option>
                      <option>Granny Flat</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hosting Address</Form.Label>
                    <Form.Control
                      readOnly
                      disabled
                      autoFocus
                      type="name"
                      placeholder=""
                      value={listingData.address}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      readOnly
                      disabled
                      autoFocus
                      type="number"
                      placeholder="350"
                      value={listingData.price}
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCity">
                      <Form.Label>Beds</Form.Label>
                      <Form.Control
                        readOnly
                        disabled
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={listingData.metadata.beds}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        readOnly
                        disabled
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={listingData.metadata.bedrooms}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        readOnly
                        disabled
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={listingData.metadata.bathrooms}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Amenities</Form.Label>
                    <Form.Select
                      readOnly
                      disabled
                      multiple
                      value={listingData.metadata.amenities}
                    >
                      <option value="TV">TV</option>
                      <option value="Wifi">Wifi</option>
                      <option value="Pool">Pool</option>
                      <option value="Patio">Patio</option>
                      <option value="Parking">Parking</option>
                      <option value="Hot Tub">Hot Tub</option>
                      <option value="Fire pit">Fire pit</option>
                      <option value="BBQ grill">BBQ grill</option>
                      <option value="Pool Table">Pool Table</option>
                      <option value="Indoor Fireplace">Indoor Fireplace</option>
                      <option value="Outdoor Dining Area">Outdoor Dining Area</option>
                    </Form.Select>
                  </Form.Group>
                  <br></br>
                  <Form.Group className="mb-3" style={ { display: 'inline-flex' } }>
                    <div style={ { fontSize: '100%' } }
                      onClick={(e) => modalReviewShow(e)}
                      onMouseEnter={() => setRatingHover(true)}
                      onMouseLeave={() => setRatingHover(false)}
                    >
                      {ratingHover
                        ? <Rating
                          name="Listing Rating"
                          value={getAvgRating()}
                          size="large" readOnly
                          style={ { verticalAlign: 'middle' } }
                          />
                        : <Rating
                          name="Listing Rating"
                          value={getAvgRating()}
                          size="medium" readOnly
                          style={ { verticalAlign: 'middle' } }
                          />
                      }
                    </div>
                    <strong style={ { fontSize: '100%' } } onClick={(e) => modalReviewShow(e)}>&nbsp;({listingData.reviews.length})</strong>
                  </Form.Group>
                  <br></br>
                  <br></br>
                  <Form.Group className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateRangePicker
                        startText="Check-in"
                        endText="Check-out"
                        inputFormat="dd/MM/yyyy"
                        value={dateRange}
                        onChange={(newValue) => {
                          setDateRange(newValue);
                        }}
                        renderInput={(startProps, endProps) => (
                          <React.Fragment>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                          </React.Fragment>
                        )}
                      />
                    </LocalizationProvider>
                  </Form.Group>
                  <br></br>
                  <Row>
                    <Col xs="auto">
                      <Button type="submit" variant="secondary" onClick={(e) => handleSubmit(e)}>
                        <small>Make Booking</small>
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" variant="secondary" onClick={(e) => canUserReview(e)}>
                        <small>Leave a Review</small>
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" variant="secondary" onClick={(e) => deleteBooking(e)}>
                        <small>Delete Booking</small>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            <br></br>
          </div>
        </div>
      </div>
      <br></br>

      <Modal show={showReviewModal} onHide={modalReviewClose}>
        <Modal.Header closeButton>
          <Modal.Title>All Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {listingData.reviews.map((review, index) => (
            <div key={index}>
              <small>{review.rating}/5: {review.comment}</small>
              <br></br>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalReviewClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLeaveReviewModal} onHide={modalLeaveReviewClose}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingTextarea2" label="Review">
            <Form.Control
              as="textarea"
              value={inputReviewText}
              placeholder="Leave a comment here"
              style={{ height: '100px' }}
              onChange={(e) => setInputReviewText(e.target.value)}
            />
          </FloatingLabel>
          <br></br>
          <Rating
            name="Listing Rating"
            value={inputReviewRating}
            size="large"
            style={ { verticalAlign: 'middle' } }
            onChange={(event, newValue) => {
              setInputReviewRating(newValue);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => submitReview(e)}>
            Submit Review
          </Button>
          <Button variant="secondary" onClick={modalLeaveReviewClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
    </>
  )
};

export default ViewListing;

ViewListing.propTypes = {
  match: PropTypes.object,
};
