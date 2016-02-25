// Import styles
import 'bootstrap/scss/bootstrap.scss';
import 'styles/core.scss';
import React from 'react';
import Navigation from 'containers/Navigation';
import coreStyles from './CoreLayout.scss';

function CoreLayout({ children }) {
  return (
    <div className={coreStyles.wrapper}>
      <Navigation />
      <div className="view-container">
        {children}
      </div>
      <div className={coreStyles['footer-push']} />
    </div>
  );
}

CoreLayout.propTypes = {
  children: React.PropTypes.element,
};

export default CoreLayout;
