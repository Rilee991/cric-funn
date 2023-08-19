import React from 'react';
import { Facebook, LinkedIn } from '@material-ui/icons';

import xImg from '../../res/images/x.png';

const SocialMedia = () => {
    const openWindow = (url) => {
        window.open(url,'_blank');
    }

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://www.facebook.com/StoneCypher33`)}>
                <Facebook className="tw-text-white-app" fontSize="large" />
            </div>
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://www.linkedin.com/in/rohit-kumar-a92418141/`)}>
                <LinkedIn className="tw-text-white-app" fontSize="large" />
            </div>
            <div className="tw-cursor-pointer" onClick={() => openWindow(`https://twitter.com/IamRohitKumar22`)}>
                <img className="tw-w-[26.25px] tw-h-[26.25px]" src={xImg} />
            </div>
        </div>
    );
}

export default SocialMedia;