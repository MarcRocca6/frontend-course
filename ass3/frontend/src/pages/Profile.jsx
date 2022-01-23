import React from 'react';
import PropTypes from 'prop-types';

const Profile = ({ match }) => {
  const { profile } = match.params;
  return (
    <>
      <h1>Profile {profile}</h1>
    </>
  )
};

export default Profile;

Profile.propTypes = {
  match: PropTypes.object,
};
