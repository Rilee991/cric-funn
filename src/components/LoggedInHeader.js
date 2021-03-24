import React from 'react';

import Navbar from './Navbar';

function LoggedInHeader(props) {
    const { loggedInUserDetails } = props;
    return (
        <Navbar loggedInUserDetails={loggedInUserDetails}/>
    );
}

export default LoggedInHeader;