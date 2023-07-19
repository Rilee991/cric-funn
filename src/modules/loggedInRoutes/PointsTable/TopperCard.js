import React from 'react';
import { Typography, Card, CardActionArea, CardContent } from '@material-ui/core';
import { round } from 'lodash';

const TopperCard = (props) => {
	const { topperDetails = {} } = props;
	const { image, bets, won, lost, points, player, subText, bgImage } = topperDetails;

	return (
        <Card style={{ boxShadow: "5px 5px 20px", backgroundImage: `url(https://img.pikbest.com/back_our/bg/20200602/bg/19b3888f1e139_337891.png)`, backgroundRepeat:"no-repeat", backgroundSize: "cover", height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
			<CardActionArea style={{ backgroundSize: "contain", backgroundImage: `url(${bgImage})`, backgroundRepeat: "no-repeat" }}>
				<CardContent className="tw-flex tw-text-white tw-items-center tw-justify-evenly sm:tw-h-[180px] tw-h-[100px]">
					<div>
						<img className="tw-w-[85px] tw-h-[85px] sm:tw-w-[150px] sm:tw-h-[150px]" src={image} />
					</div>
					<Typography variant={"button"} className="tw-flex tw-flex-col tw-justify-evenly" style={{fontSize: 15, height: "inherit"}} component="p">
						<div className="tw-leading-normal">
							<div className="">@{player}</div>
							<div className="tw-text-[10px] md:tw-text-[13px] tw-italic" style={{ fontWeight: "500 !important" }}>{subText}</div>
						</div>
						<div className="tw-flex tw-items-center tw-gap-2 sm:tw-text-[25px]">
							<div className="tw-flex tw-gap-2">
								<div className="tw-flex tw-flex-col tw-items-center">
									<div>
										<b><i>Bets</i></b>
									</div>
									<div>
										<b><i>{bets || "-"}</i></b>
									</div>
								</div>
								<div className="tw-flex tw-flex-col tw-items-center">
									<div>
										<b><i>Wins</i></b>
									</div>
									<div>
										<b><i>{won || "-"}</i></b>
									</div>
								</div>
								<div className="tw-flex tw-flex-col tw-items-center">
									<div>
										<b><i>Win %</i></b>
									</div>
									<div>
										<b><i>{(round(won/((won+lost) || 1),4).toFixed(4)*100).toFixed(2)}</i></b>
									</div>
								</div>
								<div className="tw-flex tw-flex-col tw-items-center">
									<div>
										<b><i>Points</i></b>
									</div>
									<div>
										<b><i>{points}</i></b>
									</div>
								</div>
							</div>
						</div>
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
    );
}

export default TopperCard;
