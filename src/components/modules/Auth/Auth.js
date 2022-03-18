import React, { useContext } from 'react';
import { isEmpty } from 'lodash';

import { ContextProvider } from '../../../Global/Context';

import LoggedOutComponent from './LoggedOutComponent';
import Home from './Home';
import LoadingComponent from '../../common/LoadingComponent';

const Auth = () => {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {}, loading } = contextConsumer;

    return (
        <> { 
            loading ? ( <LoadingComponent /> )
            : (!isEmpty(loggedInUserDetails) ? <Home loggedInUserDetails={loggedInUserDetails}/> : 
                <LoggedOutComponent />)
        } </>
    );
}
export default Auth;
