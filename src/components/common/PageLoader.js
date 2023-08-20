import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { SportsBaseball } from '@material-ui/icons';

import Copyright from './Copyright';

const PageLoader = (props) => {
    const { tip = "", color = "black" } = props;

    const textClassColor = `tw-text-${color}`;

    return (
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
                {/* <div className="tw-relative tw-w-24 tw-h-24 tw-animate-spin tw-rounded-full  "> */}
                    <SportsBaseball className={`${textClassColor} tw-animate-bounce tw-w-24 tw-h-24`} />
                    {/* <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-w-20 tw-h-20 tw-from-[#000000] tw-to-[#882828] tw-rounded-full tw-border-2 tw-border-white" /> */}
                {/* </div> */}
                <Typography className={`${textClassColor} tw-flex tw-items-center tw-gap-2 tw-font-noto tw-italic`} style={{fontSize: 20}} component="p">
                    <b>{tip || "Loading..."}</b>
                </Typography>
            </div>
            <Copyright textColor={color} />
        </div>
    );
}

PageLoader.propTypes = {
    tip: PropTypes.string,
    color: PropTypes.string
}

export default PageLoader;
