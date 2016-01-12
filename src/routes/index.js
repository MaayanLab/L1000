import React from 'react';
import { Route, IndexRoute } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout';
import HomeView from 'views/HomeView';
import AddNewCompound from 'views/AddNewCompoundView';
import AboutView from 'views/AboutView';
import NotFoundView from 'views/NotFoundView';

export default (
  <Route path="/" component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path="/about" component={AboutView} />
    <Route path="/experiments/:experimentId/compounds/new" component={AddNewCompound} />
    <Route path="*" component={NotFoundView} />
  </Route>
);
