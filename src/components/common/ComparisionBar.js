import React from 'react';
import { Typography } from '@material-ui/core';

const ComparisionBar = (props) => {
    const { className = "", color1 = "indigo", width1 = "50%", bgImg1, text1 = "T1", fontSize, color2 = "blue", width2 = "50%", bgImg2, text2 = "T2" } = props;

    return (
        <div style={{ background: color1 }} className={`${className} tw-h-[5vh] tw-rounded-[30px] tw-mt-2 tw-text-white tw-flex`}>
            <div style={{ backgroundColor: color1, width: width1, backgroundImage: `url(${bgImg1})`, backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "multiply" }} className="tw-rounded-[30px] tw-flex tw-items-center tw-justify-center">
            <Typography style={{fontSize: fontSize || 16, textShadow: "0 0 3px #0e0101, 0 0 5px #e7e7e9", fontFamily:"Noto Sans"}} component="p">
                <b>{`${parseFloat(width1) == 0 ? "" : text1}`}</b>
            </Typography>
            </div>
            <div style={{ backgroundColor: color2, width: width2, backgroundImage: `url(${bgImg2})`, backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "multiply" }} className="tw-rounded-[30px] tw-flex tw-items-center tw-justify-center">
            <Typography style={{fontSize: fontSize || 16, textShadow: "0 0 3px #0e0101, 0 0 5px #e7e7e9", fontFamily:"Noto Sans"}} component="p">
                <b>{`${parseFloat(width2) == 0 ? "" : text2}`}</b>
            </Typography>
            </div>
        </div>
    );
}

export default ComparisionBar;
