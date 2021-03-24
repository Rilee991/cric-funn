import React, { useContext } from 'react';
import { isEmpty } from 'lodash';

import { ContextProvider } from '../Global/Context';
import LoggedInHeader from './LoggedInHeader';
import LoggedOutHeader from './LoggedOutHeader';

function Header() {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {} } = contextConsumer;

    return ( 
        <>
            { !isEmpty(loggedInUserDetails) ? <LoggedInHeader loggedInUserDetails={loggedInUserDetails}/> : <LoggedOutHeader /> }
        </>
    );
}

export default Header;