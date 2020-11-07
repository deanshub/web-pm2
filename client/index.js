import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
// import { whyDidYouUpdate } from 'why-did-you-update';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configure from './store';
import App from './containers/App';
import HomePage from './containers/HomePage';
// whyDidYouUpdate(React);

const store = configure();
const history = syncHistoryWithStore(browserHistory, store);
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route component={HomePage} path="/" />
        <Route component={HomePage} path="/app/:pm2Id" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
