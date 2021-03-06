import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

// Inject React root element
if (document.body) {
  document.body.innerHTML += '<div id="root"></div>';
}

// Render React app in the root element
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.render(<App />, rootEl);
}
