import React, { useContext } from 'react';
import { isEmpty } from 'lodash';

import { ContextProvider } from '../Global/Context';
import Home from './Home';
import LoggedOutComponent from './LoggedOutComponent';

function Auth() {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {}, loading } = contextConsumer;
console.log(loggedInUserDetails, loading);
    return (
        <>
            { !isEmpty(loggedInUserDetails) ? <Home loggedInUserDetails={loggedInUserDetails}/> : <LoggedOutComponent /> }
        </>
    );
}
export default Auth;
