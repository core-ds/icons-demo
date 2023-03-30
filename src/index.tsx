import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Spinner } from '@alfalab/core-components/spinner/modern';

import './index.css';

const Demo = React.lazy(() => import('./components/Demo'));

const rootEl = document.getElementById('root');

if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);

    root.render(
        <React.Suspense
            fallback={
                <div className='fallback-spinner'>
                    <Spinner visible={true} size='m' />
                </div>
            }
        >
            <Demo />
        </React.Suspense>,
    );
}
