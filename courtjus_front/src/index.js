import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import coursjusReducer from './reducers/courtjusSlice';

import {createStore} from "redux";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(coursjusReducer);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
