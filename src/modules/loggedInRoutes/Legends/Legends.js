import React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import { AlternateEmail, AcUnit } from '@material-ui/icons';
import moment from 'moment';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// import { Navigation, Pagination, EffectFade, Keyboard } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";

// import styles from './customswiper.scss';

// import 'swiper/swiper-bundle.css';
// import 'swiper/modules/navigation/navigation.min.css';
// import 'swiper/modules/pagination/pagination.min.css';
// import 'swiper/modules/scrollbar/scrollbar.min.css';
// import 'swiper/modules/effect-fade/effect-fade.min.css';

const Legends = () => {
    // bgImage, bgColor, title, poster, isChampCard, period
    const legends = [{
        bgImage: "https://media.tenor.com/RhRpOYBCi9QAAAAC/wrestlemania-wwe.gif",
        bgColor: "#ffb600",
        title: "Kelly, Undisputed Universal Champion",
        poster: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/profilePictures%2Fpappu.png?alt=media&token=f2464040-b336-4425-a911-f508cec8d8ee",
        period: "2023 - Present",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString()
    }, 
    {
        bgImage: "https://s3.superluchas.com/2017/04/WM-intro.gif",
        bgColor: "#8f8fff",
        title: "Cypher33, Undisputed Universal Champion",
        poster: "https://i.redd.it/0m7fklo24ac81.jpg",
        period: "2022 - 2023",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString()
    }, {
        bgImage: "https://media.tenor.com/Smi725a4800AAAAM/wrestlemania-wwe.gif",
        bgColor: "#1f9395",
        title: "Ashu, Universal Heavyweight Champion",
        poster: "https://i.redd.it/0m7fklo24ac81.jpg",
        period: "2020 - 2021",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString()
    }, {
        bgImage: "https://media.tenor.com/ETGlhu0YplsAAAAM/wrestle-mania36-wwe.gif",
        bgColor: "#70ffa7",
        title: "Desmond, Universal Champion",
        poster: "https://i.redd.it/0m7fklo24ac81.jpg",
        period: "2018 - 2020",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString()
    }, {
        bgImage: "https://d.wattpad.com/story_parts/586476711/images/153658ab4fffc95f707318083298.gif",
        bgColor: "#da6ba1",
        title: "Broly, Inaugural Universal Champion",
        poster: "https://i.redd.it/0m7fklo24ac81.jpg",
        period: "2017 - 2018",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString()
    }
];
    
    const getChild = (legendCard) => {
        
        return (
            <CardContent className="tw-pt-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <div style={{ border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                    <Typography className="tw-flex tw-items-center tw-justify-center" variant={"button"} style={{ fontSize: 13 }}>
                        <b><AlternateEmail className="tw-text-lg" /> {legendCard.title.split(", ")[0]}</b>
                    </Typography>
                </div>
                <img src={legendCard.poster} className={legendCard.isChampCard ? "tw-w-[300px] tw-min-h-[300px] tw-max-h-[300px] tw-rounded-[50%]" : "tw-w-full tw-min-h-[300px] tw-max-h-[300px]"}/>
                <Typography className="tw-text-white tw-text-center tw-flex tw-flex-col tw-items-center tw-justify-center" variant={"button"} style={{fontSize: 18}} component="h2">
                    <b>{legendCard.title.split(", ")[1]}</b>
                    <b>{"(" + legendCard.period + ")"}</b>
                </Typography>
            </CardContent>
        );
    }

    return (
        <div>
            <VerticalTimeline lineColor="black">
                {legends.map(legend => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ boxShadow: "5px 5px 20px", borderRadius: "20px", 
                            backgroundImage: `url(${legend.bgImage})`, 
                            backgroundSize: "cover", backgroundPosition: "center", backgroundColor: legend.bgColor, 
                            backgroundBlendMode: "darken", backgroundRepeat: "no-repeat" }}
                        contentArrowStyle={{ borderRight: `7px solid  ${legend.bgColor}` }}
                        iconStyle={{ background: legend.bgColor, color: '#fff' }}
                        icon={<AcUnit />}
                    >
                        {getChild(legend)}
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
}
// 
export default Legends;