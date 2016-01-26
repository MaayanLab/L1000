import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cn from 'classnames';
import styles from './Navigation.scss';
import { logoutAndRedirect } from 'actions';

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export class Navigation extends Component {
  _handleLogOut = () => {
    this.props.logoutAndRedirect();
  };

  get navItems() {
    const { auth: { user, isAuthenticated } } = this.props;
    if (isAuthenticated) {
      return (
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className="nav-link" href="http://www.lincscloud.org/l1000/" target="_blank">
              About
            </a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/user/${user._id}/profile`}>
              {user.name}
            </Link>
          </li>
          <li className="nav-item">
            <a className={cn(['nav-link', styles['logout-btn']])} onClick={this._handleLogOut}>
              Logout
            </a>
          </li>
        </ul>
      );
    }
    return (
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
          <a className="nav-link" href="http://www.lincscloud.org/l1000/" target="_blank">
            About
          </a>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
      </ul>
    );
  }
  render() {
    return (
      <nav className={cn(['navbar', 'navbar-light', 'bg-faded', styles['main-nav']])}>
        <div className="container">
          <button
            type="button" className="navbar-toggler hidden-sm-up"
            data-toggle="collapse" data-target="#main-navbar"
          >
            &#9776;
          </button>
          <div className="collapse navbar-toggleable-xs" id="main-navbar">
            <Link className="navbar-brand" to="/">L1000 Ordering System</Link>
            {this.navItems}
          </div>
        </div>
      </nav>
    );
  }
}

Navigation.propTypes = {
  auth: PropTypes.object,
  logoutAndRedirect: PropTypes.func,
};

export default connect(mapStateToProps, {
  logoutAndRedirect,
})(Navigation);
