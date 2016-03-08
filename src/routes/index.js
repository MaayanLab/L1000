import React from 'react';
import { Route, IndexRoute } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import HomeView from 'views/HomeView';
import RegisterView from 'views/RegisterView';
import LoginView from 'views/LoginView';
import ProfileView from 'views/ProfileView';
import CartView from 'views/CartView';
import CheckoutView from 'views/CheckoutView';
import AddNewCompoundView from 'views/AddNewCompoundView';
import NotFoundView from 'views/NotFoundView';

export default (/* store */) => (
  <Route path="/" component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path="/register" component={RegisterView} />
    <Route path="/login" component={LoginView} />
    <Route path="/user/profile" component={ProfileView} />
    <Route path="/user/cart" component={CartView} />
    <Route path="/user/checkout" component={CheckoutView} />
    <Route path="/experiments/:experimentId/compounds/add" component={AddNewCompoundView} />
    <Route path="*" component={NotFoundView} />
  </Route>
);
