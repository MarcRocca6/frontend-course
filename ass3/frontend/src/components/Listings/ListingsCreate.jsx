
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';

export default function ListingsCreate () {
  const token = sessionStorage.userToken;
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyType, setPropertyType] = useState('House');
  const [beds, setBeds] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [thumbnail, setThumbnail] = useState('');
  const [amenities, setAmenities] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const modalClose = () => setShowModal(false);
  const modalShow = () => {
    setShowModal(true);
  }
  function setBase64 (filePath, file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setThumbnail(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  function error (message) {
    alert(message)
  }
  function isValidInputs () {
    if (title === '') error('Please fill in Title field')
    else if (price === '') error('Please enter a price for this hosting')
    else if (beds === '') error('Your Listing must have at least 1 bed')
    else if (bathrooms === 0) error('Your Listing must have at least 1 bathroom')
    else if (address === '') error('Please fill in Address field')
    return true
  }
  function handleSubmit (event) {
    event.preventDefault();
    if (isValidInputs()) {
      fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          title: title,
          address: address,
          price: price,
          thumbnail: thumbnail,
          metadata:
          {
            beds: beds,
            bathrooms: bathrooms,
            bedrooms: bedrooms,
            amenities: amenities,
            type: propertyType,
          },
        })
      })
        .then(response => response.json())
        .then(data => {
          modalShow()
          console.log(data)
        });
    }
  }

  return (
    <>
      <div className="Register card text-black">
        <h1 className="text-center padding-bottom-xl" >Listings Create</h1>
        <div className="card-body p-md-3">
          <Form onSubmit={handleSubmit}>
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
              <Form.Select autoFocus value={propertyType} onChange={e => setPropertyType(e.target.value)}>
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
              <Form.Select multiple value={amenities} onChange={e => setAmenities([].slice.call(e.target.selectedOptions).map(item => item.value))}>
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
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control
                type="file"
                // value={thumbnail}
                onChange={(e) => setBase64(e.target.value, e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create New Listing
            </Button>
            {/* <Button variant="secondary" onClick={modalShow}>
              Test out Submission Modal
            </Button> */}
          </Form>
        </div>
      </div>
      <Modal show={showModal} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations! 🎉🥳</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have succestfully created a new listing.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
    </>
  );
}
