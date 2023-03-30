import React from 'react';
import * as ReactDOM from 'react-dom/client';

import { Demo } from './components/Demo';

import './index.css';

const rootEl = document.getElementById('root');

if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);

    root.render(<Demo />);
}
