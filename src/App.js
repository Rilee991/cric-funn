import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { isEmpty } from 'lodash';
// import LoadingScreen from 'react-loading-screen';

import cricFunnLogo from './res/images/logo.png';

import './App.css';
import { ContextProvider } from './global1/Context';

import LoggedInRoutes from './modules/loggedInRoutes/LoggedInRoutes';
import LoggedOutRoutes from './modules/loggedOutRoutes/LoggedOutRoutes';

function Loader() {
  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-50">
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
        
        {/* Spinner */}
        {/* <div className="tw-relative">
          <div className="tw-w-16 tw-h-16 tw-border-4 tw-border-gray-200 tw-rounded-full"></div>
          <div className="tw-absolute tw-top-0 tw-left-0 tw-w-16 tw-h-16 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
        </div> */}
		<img src={cricFunnLogo} className='tw-w-52 tw-h-52' />

        {/* Text */}
        <p className="tw-text-gray-600 tw-text-sm tw-font-medium tw-tracking-wide">
          Loading, please wait...
        </p>

        {/* Animated dots */}
        <div className="tw-flex tw-gap-1">
          <span className="tw-w-2 tw-h-2 tw-bg-blue-500 tw-rounded-full tw-animate-bounce [animation-delay:-0.3s]"></span>
          <span className="tw-w-2 tw-h-2 tw-bg-blue-500 tw-rounded-full tw-animate-bounce [animation-delay:-0.15s]"></span>
          <span className="tw-w-2 tw-h-2 tw-bg-blue-500 tw-rounded-full tw-animate-bounce"></span>
        </div>

      </div>
    </div>
  );
}

const App = () => {
	const contextConsumer = useContext(ContextProvider);
	const { loading, loggedInUserDetails } = contextConsumer;

	if(loading) {
		return <Loader />
	}

	return (
		<Router>
			{/* <LoadingScreen
				loading={loading}
				bgColor="black"
				spinnerColor="#fff"
				textColor="#fff"
				text="Loading your details. Please wait..."
				logoSrc={cricFunnLogo}
			> */}
				{!isEmpty(loggedInUserDetails) ?
					<LoggedInRoutes /> : <LoggedOutRoutes /> }
			{/* </LoadingScreen> */}
		</Router>
	);
}

export default App;
