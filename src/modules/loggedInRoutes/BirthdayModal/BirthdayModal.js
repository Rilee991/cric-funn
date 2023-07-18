import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, Typography, Button, Snackbar } from '@material-ui/core';
import { PlayCircleOutlineOutlined, PauseCircleOutline, Redeem } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

import birthdaySong from '../../../images/bdaysong.mp3';
import { DEFAULT_USER_PARAMS } from '../../../configs/userConfigs';

const BirthdayModal = (props) => {
    const audioRef = useRef();
    const { open = true, closeDialog, width, isRewardClaimed, claimReward } = props;
    const [playAudio, setPlayAudio] = useState(true);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");

    const handleToastClose = () => {
        setIsToastOpen(false);
    }

    const handleOnClickLetsBet = () => {
        if(playAudio)   {
            audioRef.current.pause();
            setPlayAudio(false);
        } else {
            audioRef.current.play();
            setPlayAudio(true);
        }
    }

    const handleOnClickClaimReward = async () => {
        try {
            await claimReward(DEFAULT_USER_PARAMS.BIRTHDAY_GIFT_POINTS);
            setIsToastOpen(true);
            setSeverity("success");
            setMessage("100 points claimed successfully");
        } catch (error) {
            setIsToastOpen(true);
            setSeverity("error");
            setMessage(error.message);
        }
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="xl">
            <DialogContent className="tw-flex tw-flex-col tw-items-center tw-justify-end tw-rounded-[40px] tw-p-2 tw-bg-center tw-bg-pink-700 tw-bg-contain tw-bg-[url(https://static.vecteezy.com/system/resources/previews/011/236/431/original/confetti-and-luxury-gold-balloon-birthday-celebration-border-free-png.png)]">
                <div>
                    <img src="https://tipsmake.com/data/images/the-animation-of-happy-birthday-adds-meaning-picture-15-XfzccofXT.gif" />
                </div>
                {!isRewardClaimed && <div className="tw-flex tw-justify-center">
                    <img src="https://cdn.icon-icons.com/icons2/3582/PNG/512/reward_lottery_money_cash_prize_icon_225876.png" width="30%" />
                </div> }
                
                <DialogContentText className={`tw-flex tw-gap-2 tw-items-center tw-justify-end ${width > 500 ? "" : "tw-flex-col"}`}>
                    <Button size="large" className="tw-rounded-[40px]" style={{ background: "linear-gradient(0deg, #1b004a, #50045a)", color: "white" }} variant="contained" onClick={() => handleOnClickLetsBet()}>
						<Typography variant="overline">
							{playAudio ? <>Playing <PauseCircleOutline/> </> : <>Stopped <PlayCircleOutlineOutlined/> </>}
						</Typography>
					</Button>
                    {!isRewardClaimed && <Button size="large" className="tw-rounded-[40px]" style={{ background: "url(https://i.pinimg.com/originals/6b/e8/9b/6be89b96350815f624315e0096b72cbc.gif)", backgroundSize: "contain", backgroundColor: "#8b1b93", backgroundPosition: "center", color: "white" }} variant="contained" onClick={() => handleOnClickClaimReward()}>
						<Typography variant="overline">
							{"Claim Reward"} <Redeem />
						</Typography>
					</Button>}
                </DialogContentText>
            </DialogContent>
            <audio autoPlay src={birthdaySong} loop ref={audioRef}></audio>
            <Snackbar open={isToastOpen} autoHideDuration={3000} onClose={handleToastClose} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                <Alert className="tw-rounded-3xl" variant="filled" onClose={handleToastClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

export default BirthdayModal;
