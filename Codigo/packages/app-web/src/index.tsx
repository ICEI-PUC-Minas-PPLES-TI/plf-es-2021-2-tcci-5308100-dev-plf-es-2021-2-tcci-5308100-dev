import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import '@fortawesome/fontawesome-free/js/all.min'
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import '~/assets/css/styles.css';
import '~/assets/css/sidebar.css';
import '~/assets/css/header.css';
import '~/assets/css/toast.css';
import '~/assets/css/background.css';
import '~/assets/css/masonry.css';
import '~/assets/css/custom.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
