import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import SimpleNavBar from './components/NavBar/simpleNavBar';

import Home from './pages/Home';
import Math from './pages/Math';
import Connect from './pages/Connect';
import Memory from './pages/Memory';
import Page4 from './pages/Page4';

function App() {

  return (
    <div id="App">
      <div id="background">
        <BrowserRouter>
          
          <main id="mainBody">
            <Switch>
              <Route
                exact path='/dashboard'
                component = {Home}
              />
              <Route
                exact path='/game/Math'
                render={(props) => {
                  return <Math {...props}/>;
                }}
              />
              <Route
                exact path='/game/Connect'
                render={(props) => {
                  return <Connect {...props}/>;
                }}
              />
              <Route
                exact path='/game/Memory'
                render={(props) => {
                  return <Memory {...props}/>;
                }}
              />
              <Route
                exact path='/page4'
                render={(props) => {
                  return <Page4 {...props}/>;
                }}
              />
              <Route 
                exact path='/'
                component = {Home}
              />
            </Switch>
          </main>

          <SimpleNavBar/>          
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;