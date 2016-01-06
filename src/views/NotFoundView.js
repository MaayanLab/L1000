import React, { Component } from 'react';
import { Link } from 'react-router';

export class NotFoundView extends Component {
  render() {
    return (
      <div className="container text-center">
        <h1>404</h1>
        <Link to="/">Back To Home View</Link>
      </div>
    );
  }
}

export default NotFoundView;
