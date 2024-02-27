import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

import notFound404Img from '../../res/images/404img.png';

const NotFoundError = () => {
    return (
        <div className="tw-bg-black-app tw-flex tw-items-center tw-justify-center tw-h-auto tw-min-h-screen tw-py-12">
            <div className="tw-bg-[#a3b3cb] tw-border-hidden tw-border tw-rounded-md tw-flex tw-items-center tw-justify-center tw-mx-4 md:tw-w-2/3">
                <div className="tw-flex tw-flex-col tw-items-center tw-py-16">
                    <img className="tw-px-4 tw-block" alt="404 Not found.jpeg" src={notFound404Img} />
                    <h1 className="tw-px-4 tw-pt-8 tw-pb-4 tw-text-center tw-text-black tw-text-3xl tw-font-bold tw-leading-10">Looks like you've found the doorway to the great nothing!</h1>
                    <p className="tw-px-4 tw-pb-4 tw-text-base tw-leading-none tw-text-black tw-text-center">The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the link.</p>
                    <p className="tw-px-4 tw-pb-10 tw-text-base tw-leading-none tw-text-black tw-text-center">Sorry about that! Please visit our hompage to get where you need to go..</p>
                    <Link to="/">
                        <Button className="tw-font-noto tw-bg-[#5944FF] tw-text-white" variant="contained">Go Back</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundError;
