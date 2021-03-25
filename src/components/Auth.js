import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

import { ContextProvider } from '../Global/Context';
import Home from './Home';
import LoggedOutComponent from './LoggedOutComponent';

function Auth() {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {}, loading } = contextConsumer;

    return (
        <>
            { loading ? <Loader type="Puff" color="#00BFFF" height={100} width={200} timeout={5000} /> : (!isEmpty(loggedInUserDetails) ? <Home loggedInUserDetails={loggedInUserDetails}/> : <LoggedOutComponent />) }
        </>
    );
}
export default Auth;
