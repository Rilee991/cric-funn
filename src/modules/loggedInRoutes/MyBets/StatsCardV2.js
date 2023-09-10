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

const StatsCardV2 = () => {
    return (
        <Card style={{ boxShadow: "5px 5px 20px", height: "auto" }} className="tw-mt-2 tw-w-52 tw-mb-10 tw-rounded-[20px]">
            <CardActionArea>
                <CardContent className="tw-flex tw-h-24 tw-flex-col tw-bg-[url(https://cdn-icons-png.flaticon.com/512/5971/5971593.png))] tw-justify-between tw-bg-no-repeat tw-bg-contain tw-bg-right">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <div>
                            <div className="tw-flex tw-items-center tw-justify-center tw-text-4xl tw-italic">
                                56
                            </div>
                            <div>
                                Played
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
