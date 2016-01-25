import React, { Component } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';
import styles from './Navigation.scss';

export default class Navigation extends Component {
  render() {
    return (
      <nav className={cn(['navbar', 'navbar-light', 'bg-faded', styles['main-nav']])}>
        <div className="container">
          <button
            type="button"
            className="navbar-toggler hidden-sm-up"
            data-toggle="collapse"
            data-target="#main-navbar"
          >
            &#9776;
          </button>
          <div className="collapse navbar-toggleable-xs" id="main-navbar">
            <Link className="navbar-brand" to="/">L1000 Ordering System</Link>
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
