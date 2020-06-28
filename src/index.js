import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';

import * as firebase from 'firebase';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FB_KEY,
  authDomain: "chat-app-ca8ee.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: "chat-app-ca8ee",
  storageBucket: "chat-app-ca8ee.appspot.com",
  messagingSenderId: "163488329574",
  appId: "1:163488329574:web:34e9afd89252de83e322a7"
})

const routing = (
  <Router>
    <div id='routing-container'>
      <Route exact path='/'>
        <Redirect to='/login'></Redirect>
      </Route>
      <Route exact path='/index.html'>
        <Redirect to='/login'></Redirect>
      </Route>
      <Route path='/login' component={LoginComponent}></Route>
      <Route path='/signup' component={SignupComponent}></Route>
      <Route path='/dashboard' component={DashboardComponent}></Route>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

serviceWorker.unregister();
