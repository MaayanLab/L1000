import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';
import coreStyles from './Navigation.scss';

export default function Navigation(/* props */) {
  return (
    <nav className={coreStyles['nav-outer']}>
      <div className={cn(['container', coreStyles['nav-inner']])}>
        <div className="navbar-header">
          <Link className={coreStyles.brand} to="/">L1000 Ordering System</Link>
        </div>
        <div>
          <ul className={coreStyles['right-nav']}>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
