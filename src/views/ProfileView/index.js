import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import { routeActions } from 'react-router-redux';

// import styles from './ProfileView.scss';

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export class ProfileView extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div className="container">
      <h1>{auth.user.email}</h1>
      </div>
    );
  }
}

ProfileView.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  ...routeActions,
})(ProfileView);
