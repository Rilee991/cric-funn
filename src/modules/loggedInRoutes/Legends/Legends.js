import React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import { startCase } from 'lodash';
import { SiAnsible, SiBabel, SiCodio, SiDisroot, SiKongregate, SiZig } from 'react-icons/si';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import hallOfFame from '../../../res/images/hof.png';
import broly from '../../../res/images/broly.png';
import ashu from '../../../res/images/ashu.png';
import desmond from '../../../res/images/desmond.png';
import cypher from '../../../res/images/cyphernew.png';

// import { Navigation, Pagination, EffectFade, Keyboard } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";

// import styles from './customswiper.scss';

// import 'swiper/swiper-bundle.css';
// import 'swiper/modules/navigation/navigation.min.css';
// import 'swiper/modules/pagination/pagination.min.css';
// import 'swiper/modules/scrollbar/scrollbar.min.css';
// import 'swiper/modules/effect-fade/effect-fade.min.css';

const Legends = () => {
    // SiKongregate SiAnsible SiBlazemeter SiCodio SiDeepnote SiSparkar
    const width = window.innerWidth;
    const legends = [{
        bgImage: "https://media.tenor.com/RhRpOYBCi9QAAAAd/wrestlemania-wwe.gif",
        bgColor: "#7177ff",
        title: "Kelly, Undisputed Universal Champion",
        poster: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/profilePictures%2Fpappu.png?alt=media&token=f2464040-b336-4425-a911-f508cec8d8ee",
        period: "2023 - Present",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString(),
        thumbnail: <SiKongregate />
    }, 
    {
        bgImage: "https://thumbs.gfycat.com/RichMinorBluet-size_restricted.gif",
        bgColor: "#8f8fff",
        title: "Cypher33, Undisputed Universal Champion",
        poster: cypher,
        period: "2022 - 2023",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString(),
        thumbnail: <SiCodio />
    }, {
        bgImage: "https://i.pinimg.com/originals/10/be/be/10bebe36032915cf79ae1096ebde66f3.gif",
        bgColor: "#1f9395",
        title: "Ashu, Universal Heavyweight Champion",
        poster: ashu,
        period: "2020 - 2021",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString(),
        thumbnail: <SiAnsible />
    }, {
        bgImage: "https://media.tenor.com/ETGlhu0YplsAAAAM/wrestle-mania36-wwe.gif",
        bgColor: "#00dae5",
        title: "Desmond, Universal Champion",
        poster: desmond,
        period: "2018 - 2020",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString(),
        thumbnail: <SiDisroot />
    }, {
        bgImage: "https://i.gifer.com/QjrR.gif",
        bgColor: "#d7b60c",
        title: "Broly, Inaugural Universal Champion",
        poster: broly,
        period: "2017 - 2018",
        isChampCard: true,
        date: moment("2023-05-30 02:30:30").toISOString(),
        thumbnail: <SiBabel />
    }];
    
    const getChild = (legendCard) => {
        return (
            <CardContent className="tw-pt-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <Typography className="tw-flex tw-text-white-app tw-items-center tw-justify-center tw-p-1 tw-font-autography" style={{ fontSize: "xxx-large" }}>
                    <b><span className="tw-text-[56px]">@</span><span>{startCase(legendCard.title.split(", ")[0])}</span></b>
                </Typography>
                <img src={legendCard.poster} className={legendCard.isChampCard ? "tw-w-[300px] tw-min-h-[300px] tw-mt-5 tw-max-h-[300px] tw-rounded-[50%]" : "tw-w-full tw-min-h-[300px] tw-max-h-[300px]"}/>
                <Typography className="tw-text-white tw-font-noto tw-text-center tw-flex tw-flex-col tw-items-center tw-justify-center" style={{fontSize: 18}} component="h2">
                    <b>{startCase(legendCard.title.split(", ")[1])}</b>
                    <b>{"(" + legendCard.period + ")"}</b>
                </Typography>
            </CardContent>
        );
    }

    return (
        <div className="tw-bg-[url(https://www.plasticstoday.com/sites/plasticstoday.com/files/styles/article_featured_standard/public/awards-d1sk-Adobe-1540x800.jpg?itok=Mgg294rp)]">
            <div className="tw-flex tw-justify-center">
                <img src={hallOfFame} width={300} height={170} />
            </div>
            <VerticalTimeline lineColor="white" layout="1-column">
                {legends.map(legend => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ boxShadow: "5px 5px 20px", borderRadius: "20px", 
                            backgroundImage: `url(${legend.bgImage})`, 
                            backgroundSize: "100% 100%", backgroundPosition: "center", backgroundColor: legend.bgColor, 
                            backgroundBlendMode: "darken", backgroundRepeat: "no-repeat", margin: width < 500 ? 0 : "" }}
                        contentArrowStyle={{ borderRight: `7px solid  ${legend.bgColor}` }}
                        iconStyle={{ background: legend.bgColor, color: '#fff', zIndex: 0 }}
                        icon={legend.thumbnail || <SiZig />}
                    >
                        {getChild(legend)}
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
}

export default Legends;