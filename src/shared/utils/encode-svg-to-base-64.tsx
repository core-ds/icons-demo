import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ICONS } from '../config';
import { IconPackageName } from '../../types';

export const encodeSvgToBase64 = (packageName: IconPackageName, reactIconName: string) => {
    const Component = ICONS[packageName][reactIconName];
    const svgString = ReactDOMServer.renderToStaticMarkup(<Component />);

    return btoa(svgString);
};
