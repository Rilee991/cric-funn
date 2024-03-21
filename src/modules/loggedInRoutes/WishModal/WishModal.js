import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

const WishModal = (props) => {
    const { openWishModal = true, closeDialog, username, wishModalSeen  } = props;

    const messages = {
        "desmond": {
            title: "Be the champion that you were meant to be!",
            lastChampDate: "Nov 2020 (4 yrs ago)"
        }, 
        "Broly": {
            title: "It all started with you, make this WrestleMania end with you!",
            lastChampDate: "Oct 2018 (6 yrs ago)"
        }, 
        "kelly": {
            title: "You won when everybody ruled you out! Defend with honor!",
            lastChampDate: "You're the champ! Defend like it!"
        }, 
        "SD": {
            title: "Clinch your 1st title and make history!",
            lastChampDate: "About time to become undisputed champion!"
        }, 
        "ashu": {
            title: "Become the coolest champ again!",
            lastChampDate: "Apr 2021 (3 yrs ago)"
        },
        "Cypher33": {
            title: "You always find your way to the top! Do it again!",
            lastChampDate: "Jun 2023 (1 yr ago)"
        }
    }

    const handleOnClickBegin = async () => {
        closeDialog();
        wishModalSeen && wishModalSeen();
    }

    return (
        <Dialog open={openWishModal} onClose={closeDialog} maxWidth="xl">
            <DialogContent className="tw-flex  tw-flex-col tw-items-center tw-justify-end tw-rounded-[40px] tw-p-2 tw-bg-center tw-bg-green-900">
                <div className="tw-max-w-md tw-mx-auto tw-bg-transparent tw-p-6 tw-rounded-lg tw-shadow-md">
                <div class="tw-absolute tw-inset-0 tw-rounded-lg" style={{ backgroundImage: 'url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f93c7dd1-057f-44a2-b7d6-a57152289672/dff5kci-38578bc7-6dfb-46a9-bf6a-c87a948b04f2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y5M2M3ZGQxLTA1N2YtNDRhMi1iN2Q2LWE1NzE1MjI4OTY3MlwvZGZmNWtjaS0zODU3OGJjNy02ZGZiLTQ2YTktYmY2YS1jODdhOTQ4YjA0ZjIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.jBxcJkZd3U1o8401SEMwJ9ImTwrBk3VEk9M6avNcy6M)', backgroundSize: "contain", backgroundRepeat:"no-repeat", backgroundPosition: "center", opacity: 0.2}}></div>
                    
                    <h1 className="tw-text-center tw-font-noto tw-text-2xl tw-mb-4 tw-font-extrabold tw-text-white-app">{messages[username]?.title || "Step into the ring of life!"}</h1>
                    <p className="tw-text-justify tw-leading-relaxed tw-mt-4 tw-text-white-app tw-font-semibold tw-font-noto">
                        IPL isn't just about the superstars in the cricket field – it's a reminder that 
                        greatness is achieved when we push ourselves beyond our limits, when we refuse to back down in the face of 
                        adversity, and when we give our absolute best in everything we do.
                    </p>
                    <p className="tw-text-justify tw-font-noto tw-leading-relaxed tw-mt-4 tw-text-white-app tw-font-semibold">
                        So, remember the spirit of WrestleMania: embrace the challenge, rise to the occasion, and leave it all on the mat.
                    </p>
                    <p className="tw-text-justify tw-font-noto tw-leading-relaxed tw-mt-4 tw-text-white-app tw-font-extrabold">
                        Your moment of glory awaits – give it your best shot and make WrestleMania'24 your personal triumph!
                    </p>
                    
                    <div class="tw-flex tw-justify-between tw-items-center tw-mt-6">
                        <div>
                            <p className="tw-text-justify tw-font-noto tw-leading-relaxed tw-text-white-app tw-font-extrabold">
                                Last championed at
                            </p>
                            <p className="tw-text-justify tw-font-noto tw-leading-relaxed tw-text-white-app tw-font-extrabold">
                                {messages[username]?.lastChampDate}
                            </p>
                        </div>
                        <Button onClick={() => handleOnClickBegin()} className="tw-bg-blue-800 tw-text-white-app tw-rounded-lg tw-font-noto">let's begin!</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default WishModal;
