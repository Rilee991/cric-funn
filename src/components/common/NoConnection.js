import React from 'react';

import noConnectionPng from '../../res/images/noConn.webp';

const NoConnection = () => {
    return (
        <div className="tw-grid tw-place-items-center">
            <img src={noConnectionPng} alt="No connection" />
            <div className="tw-font-bold tw-text-red-600">It seems you're not connected to the internet!</div>
            <div>Please fix your connection.</div>
            <div className="tw-text-green-800 tw-font-semibold">Page will load automatically once the issue is fixed.</div>
        </div>
    );
}

export default NoConnection;
