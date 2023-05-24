import React, { useContext } from 'react';
import { isEmpty } from 'lodash';

import { ContextProvider } from '../../../Global/Context';

import LoggedInHeader from './LoggedInHeader copy';
import LoggedOutHeader from './LoggedOutHeader';

const Header = (props) => {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {} } = contextConsumer;

    return ( 
        <>
            { !isEmpty(loggedInUserDetails) ? <LoggedInHeader setIsDrawerOpen={props.setIsDrawerOpen} /> : <LoggedOutHeader /> }
        </>
    );
}

export default Header;