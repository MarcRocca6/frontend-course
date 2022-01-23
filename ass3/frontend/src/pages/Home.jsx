import React from 'react';
import ListListings from '../components/Listings/ListListings'
import SearchListings from '../components/Listings/SearchListings'

// const searchContext = React.createContext()

const Home = () => {
  // Define Use States
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [priceRange, setPriceRange] = React.useState([50, 100]);
  const [location, setLocation] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [buttonPress, setButton] = React.useState(0);

  return (
    <>
      {/* <searchContext.Provider > */}
        <br></br>
        <div className="Login card text-black">
          <h1 className="text-center padding-bottom-xl" >Welcome! Explore some of our Listings</h1>
            <div className="card-body p-md-5">
              <br></br>
              <SearchListings
                setStates={[setCheckIn, setCheckOut,
                  setPriceRange, setLocation, setTitle]}
                getState={[checkIn, checkOut]}
                buttonFlag={[buttonPress, setButton]}
              />
              <ListListings
                getStates={[checkIn, checkOut,
                  priceRange, location, title]}
                buttonChange={buttonPress}
              />
            </div>
        </div>
      {/* </searchContext.Provider> */}
    </>
  )
};

export default Home;
