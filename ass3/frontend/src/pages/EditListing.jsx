import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { useHistory } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

const EditListing = ({ match }) => {
  const history = useHistory();
  const { listingId } = match.params;
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyType, setPropertyType] = useState('House');
  const [beds, setBeds] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [thumbnail, setThumbnail] = useState('');
  const [displayImages, setDisplayImages] = useState([]);
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const token = sessionStorage.userToken;

  function setBase64Thumbnail (filePath, file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setThumbnail(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  function setBase64Additional (filePath, files) {
    const images = []
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function () {
        images.push(reader.result)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
    setImages(images)
  }
  function handleSubmit (event, redirect) {
    event.preventDefault()
    const body = ({
      title: title,
      address: address,
      price: price,
      metadata:
      {
        beds: beds,
        bathrooms: bathrooms,
        bedrooms: bedrooms,
        amenities: amenities,
        type: propertyType,
      },
    })
    if (thumbnail !== '') { body.thumbnail = thumbnail }
    if (images !== []) { body.metadata.images = images }
    fetch('http://localhost:5005/listings/' + listingId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(responseData => {
        setDisplayImages(images)
        if (redirect) history.push('/hostedListings');
      });
  }

  const defaultImgs = require('./../components/Listings/defaultImgs.json');
  function getThumbnail () {
    if (thumbnail === '') {
      return defaultImgs.ImageNotAvaliable
    } else return thumbnail
  }
  function getAdditionalImages () {
    if (displayImages.length === 0) {
      return [[defaultImgs.ImageNotAvaliable, 1]]
    } else {
      const imgKey = []
      for (let i = 0; i < displayImages.length; i++) {
        imgKey.push([displayImages[i], i])
      }
      return imgKey
    }
  }
  React.useEffect(() => {
    fetch('http://localhost:5005/listings/' + listingId)
      .then(response => response.json())
      .then(data => {
        const listing = data.listing
        console.log(data)
        setTitle(listing.title);
        setAddress(listing.address);
        setPrice(listing.price);
        if (listing.metadata.type !== undefined) setPropertyType(listing.metadata.type);
        if (listing.metadata.beds !== undefined) setBeds(parseInt(listing.metadata.beds));
        if (listing.metadata.bedrooms !== undefined) setBedrooms(parseInt(listing.metadata.bedrooms));
        if (listing.metadata.bathrooms !== undefined) setBathrooms(parseInt(listing.metadata.bathrooms));
        if (listing.metadata.amenities !== undefined) setAmenities(listing.metadata.amenities);
        if (listing.thumbnail !== undefined) setThumbnail(listing.thumbnail);
        if (listing.metadata.images !== undefined) {
          setImages(listing.metadata.images);
          setDisplayImages(listing.metadata.images);
        }
      });
  }, [])
  return (
    <>
      <br></br>
      <h1 className="text-center padding-bottom-xl" >Edit Listing</h1>
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
          </div>
          <div className='col-sm'>
            <div className="card text-black">
              <div className="card-body p-md-3">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                      <Form.Control
                        autoFocus
                        type="name"
                        placeholder=""
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Property Type</Form.Label>
                    <Form.Select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value)}
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
                      autoFocus
                      type="name"
                      placeholder=""
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      autoFocus
                      type="number"
                      placeholder="350"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCity">
                      <Form.Label>Beds</Form.Label>
                      <Form.Control
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        autoFocus
                        type="number"
                        placeholder="1"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Amenities</Form.Label>
                    <Form.Select
                      multiple
                      value={amenities}
                      onChange={e => setAmenities([].slice.call(e.target.selectedOptions).map(item => item.value))}
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
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Thumbnail</Form.Label>
                    <Form.Control
                      type="file"
                      // value={thumbnail}
                      onChange={(e) => setBase64Thumbnail(e.target.value, e.target.files[0])}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Additional Images</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      // value={thumbnail}
                      onChange={(e) => setBase64Additional(e.target.value, e.target.files)}
                    />
                  </Form.Group>
                  <br></br>
                  <Row>
                    <Col xs="auto">
                      <Button type="submit" variant="secondary" onClick={(e) => handleSubmit(e, false)}>
                        <small>Submit Edit</small>
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" variant="secondary" onClick={(e) => handleSubmit(e, true)}>
                        <small>Submit & Redirect</small>
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
    </>
  )
};

export default EditListing;

EditListing.propTypes = {
  match: PropTypes.object,
};
