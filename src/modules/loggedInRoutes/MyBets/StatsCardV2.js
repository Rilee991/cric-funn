import React from 'react';
import { Card, CardContent, CardActionArea, LinearProgress, withStyles } from '@material-ui/core';
import { BiBaseball } from 'react-icons/bi';

import backGround from '../../../res/images/stats.jpg';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

const StatsCardV2 = (props) => {
    return (
        <Card style={{ boxShadow: "1px 1px 10px", height: "auto" }} className="tw-mt-2 tw-w-52 tw-rounded-[20px]">
            <CardActionArea>
                <CardContent style={{ background: `url(${props.background})` }} className="tw-flex tw-h-24 tw-flex-col tw-justify-between tw-bg-no-repeat tw-bg-contain tw-bg-right">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <div className="tw-flex tw-flex-col tw-items-start tw-justify-center">
                            <div className="tw-flex tw-leading-7 tw-items-center tw-justify-center tw-text-4xl tw-italic tw-font-bold">
                                {props.text || "-"}
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-center tw-italic">
                                {props.title || "NA"}
                            </div>
                        </div>
                    </div>
                    <div>
                        <BorderLinearProgress variant="determinate" value={50} />
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default StatsCardV2;
