import React from 'react';
import { Facebook, LinkedIn, Twitter } from '@material-ui/icons';

const SocialMedia = () => {
    const openWindow = (url) => {
        window.open(url,'_blank');
    }

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://www.facebook.com/StoneCypher33`)}>
                <Facebook htmlColor="#106be9" fontSize="large" />
            </div>
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://www.linkedin.com/in/rohit-kumar-a92418141/`)}>
                <LinkedIn htmlColor="#2b55f7" fontSize="large" />
            </div>
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://twitter.com/IamRohitKumar22`)}>
                <img className="tw-w-11 tw-h-11" src="https://vectorseek.com/wp-content/uploads/2023/07/Twitter-X-Logo-Vector-01-2.jpg" />
            </div>
        </div>
    );
}

export default SocialMedia;