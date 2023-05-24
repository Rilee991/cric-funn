import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

const NotFoundError = () => {
    return (
        <div className="tw-bg-gray-900 tw-flex tw-items-center tw-justify-center tw-h-screen tw-py-12">
            <div className="tw-bg-gray-300 tw-border-hidden tw-border dark:tw-border-green-900 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-mx-4 md:tw-w-2/3">
                <div className="tw-flex tw-flex-col tw-items-center tw-py-16">
                    <img className="tw-px-4 tw-hidden md:tw-block" src="https://i.ibb.co/9Vs73RF/undraw-page-not-found-su7k-1-3.png"/>
                    <img className="md:tw-hidden" src="https://i.ibb.co/RgYQvV7/undraw-page-not-found-su7k-1.png" />
                    <h1 className="tw-px-4 tw-pt-8 tw-pb-4 tw-text-center dark:tw-text-black tw-text-3xl tw-font-bold tw-leading-10 tw-text-gray-800">Looks like you've found the doorway to the great nothing!</h1>
                    <p className="tw-px-4 tw-pb-4 tw-text-base tw-leading-none dark:tw-text-black tw-text-center tw-text-gray-600">The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the link.</p>
                    <p className="tw-px-4 tw-pb-10 tw-text-base tw-leading-none dark:tw-text-black tw-text-center tw-text-gray-600">Sorry about that! Please visit our hompage to get where you need to go..</p>
                    <Link to="/">
                        <Button variant="contained" color="primary">Go Back</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundError;
