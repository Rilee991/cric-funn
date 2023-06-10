import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import Copyright from './Copyright';

const LoaderV2 = (props) => {
    const { tip = "" } = props;

    return (
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[160%]">
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
                <div className="tw-relative tw-w-24 tw-h-24 tw-animate-spin tw-rounded-full tw-bg-gradient-to-r tw-from-[#605317] tw-via-[#8902ff] tw-to-[#250c51] ">
                    <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-w-20 tw-h-20 tw-from-[#000000] tw-to-[#882828] tw-rounded-full tw-border-2 tw-border-white" />
                </div>
                <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-black tw-font-mono tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{tip || "Loading..."}</b>
                    </Typography>
            </div>
            <Copyright />
        </div>
    );
}

LoaderV2.propTypes = {
    tip: PropTypes.string
}

export default LoaderV2;
