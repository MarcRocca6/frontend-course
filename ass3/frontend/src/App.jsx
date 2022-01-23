import React from 'react';
import { AuthProvider } from './AuthContext';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import NavBar from './components/NavBar/NavBar';
import SecureRoute from './SecureRoute';

import Home from './pages/Home';
import HostedListings from './pages/HostedListings';
import EditListing from './pages/EditListing';
import ViewListing from './pages/ViewListing';
import AllListings from './pages/AllListings';
import CreateListing from './pages/CreateListing';
import BookingRequests from './pages/BookingRequests';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App () {
  const [authDetails, setAuthDetails] = React.useState(sessionStorage.userToken);

  function setAuth (token) {
    sessionStorage.userToken = token;
    setAuthDetails(token)
  }

  return (
    <AuthProvider value={authDetails}>
      <BrowserRouter>
        <NavBar setAuth={setAuth}/>
        <Switch>
          <Route
            path='/login'
            render={(props) => {
              return <Login {...props} setAuth={setAuth} />;
            }}
          />
          <Route
            exact path='/register'
            render={(props) => {
              return <Register {...props} setAuth={setAuth} />;
            }}
          />
          <SecureRoute exact path='/hostedListings' component={HostedListings}/>
          <SecureRoute exact path='/profile/:profile' component={Profile}/>
          <SecureRoute exact path='/bookingRequests/:listingId' component={BookingRequests}/>
          <Route exact path='/editListing/:listingId' component={EditListing}/>
          <SecureRoute exact path='/viewListing/:listingId' component={ViewListing}/>
          <Route exact path='/allListings' component={AllListings}/>
          <SecureRoute exact path='/createListing' component={CreateListing}/>
          <Route exact path='/' component={Home}/>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
