import React from 'react';

import ListHostedListings from '../components/Listings/ListHostedListings'

const HostedListings = () => {
  return (
    <>
      <br></br>
      <div className="text-black">
          <h1 className="text-center padding-bottom-xs" >Hosted Listings</h1>
            <div className="card-body p-md-5">
              <ListHostedListings/>
            </div>
        </div>
    </>
  )
};

export default HostedListings;
