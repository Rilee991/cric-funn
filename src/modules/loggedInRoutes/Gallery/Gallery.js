import React, { useContext, useEffect } from 'react';
import { Accordion, Typography, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { SiZig } from 'react-icons/si';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import 'react-vertical-timeline-component/style.min.css';
import { ContextProvider } from '../../../global/Context';
import { updateConfig } from '../../../apis/configurationsController';

const WrestleMania = ({ section }) => {
    return (
        <div className="tw-w-full">
            <VerticalTimeline lineColor="white" layout="1-column">
                {section.map(data => (
                    <div>
                        <Typography className="tw-grid tw-place-content-center tw-p-2 tw-font-noto tw-text-xl">{data.title}</Typography>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work tw-mt-0 tw-mb-10 tw-ml-0"
                            contentStyle={{
                                boxShadow: "5px 5px 20px",
                                borderRadius: "20px",
                                borderColor: "white",
                                borderWidth: 2,
                                backgroundImage: `url(${data.bgImage || ""})`, 
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundColor: data.bgColor, 
                                backgroundBlendMode: "",
                                backgroundRepeat: "no-repeat",
                                height: data.height || 450,
                                marginLeft: 0
                            }}
                            contentArrowStyle={{ borderRight: `7px solid  ${data.bgColor}`,  }}
                            iconStyle={{ background: data.bgColor, color: '#fff', zIndex: 1, display: "none" }}
                            icon={data.thumbnail || <SiZig />}
                        >
                            {data.bgVideo ?
                                <video controls loop className="tw-h-full">
                                    <source src={data.bgVideo} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                </video> : null
                            }
                        </VerticalTimelineElement>
                    </div>
                ))}
            </VerticalTimeline>
        </div>
    );
}

const Gallery = () => {
    const [expanded, setExpanded] = React.useState(0);
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails: { username }, configurations = {}, setConfigurations } = contextConsumer;

    useEffect(() => {
        updateConfig(configurations, username, "Gallery", setConfigurations);
    },[]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const gallery = [{
        title: "WrestleMania 25",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f2e3247-62d6-4d91-8b66-596cdde4d62b/decfzk2-bfe338d1-df73-4136-a8e3-39a4a6ed3b84.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFmMmUzMjQ3LTYyZDYtNGQ5MS04YjY2LTU5NmNkZGU0ZDYyYlwvZGVjZnprMi1iZmUzMzhkMS1kZjczLTQxMzYtYThlMy0zOWE0YTZlZDNiODQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.hH9eh3faKC5msXFFF9c3p2vZpPqMG7RuspdmRR833pY",
        section: [{
            title: "WrestleMania 25 - Official Poster",
            bgImage: "https://cache.careers360.mobi/media/presets/860X430/article_images/2020/9/21/MHT-news.png",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 24",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/377bb3e8-ff8c-4984-8530-64b9afb9d321/dff9nq3-9bd05d41-c893-44ea-af84-f18493cbd3e4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3N2JiM2U4LWZmOGMtNDk4NC04NTMwLTY0YjlhZmI5ZDMyMVwvZGZmOW5xMy05YmQwNWQ0MS1jODkzLTQ0ZWEtYWY4NC1mMTg0OTNjYmQzZTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BUTDCeXxdiYd5Tf0EQYbaGvq6fQ1q9LMW5bMZztAAVo",
        section: [{
            title: "WrestleMania 24 - Match 1, Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM24_Match1.png?alt=media&token=4a51c0af-bdde-4866-9d6f-d27b283f43d2",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 24 - King of the Ring, Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM24_Match2.png?alt=media&token=8c6b2b30-8b0d-4391-a2de-e330d0261bff",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 24 - Universal Championship, Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM24_MainEvent.png?alt=media&token=b997c777-99b5-42b5-a516-f1db71a3f40a",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 24 - King Of the Ring Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM24_KOTR_Winner.png?alt=media&token=d26f9df2-f617-40ec-8518-11d3fcedcba1",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 24 - Universal Championship Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM24_UC_Winner.png?alt=media&token=e2cccb73-ebc5-433e-b53c-f1f2e8b5f184",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 23",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/377bb3e8-ff8c-4984-8530-64b9afb9d321/dfbiq18-e39afd7a-6564-420e-9912-526f2c2bcfb6.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3N2JiM2U4LWZmOGMtNDk4NC04NTMwLTY0YjlhZmI5ZDMyMVwvZGZiaXExOC1lMzlhZmQ3YS02NTY0LTQyMGUtOTkxMi01MjZmMmMyYmNmYjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.e9mHkhz6ykFm2j4mKm3PSYKryNQOAA61AMaMyS3R5tU",
        section: [{
            title: "WrestleMania 23 - Broly (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Broly.png?alt=media&token=fe5db070-6f43-4d00-a0c2-23cd5191783d",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - Ashu (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Ashu.png?alt=media&token=81b8407f-839a-4cc7-887d-2f05e986faeb",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - SD (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_SD.png?alt=media&token=01f2a2e7-f22c-4be7-9ddf-344896e14e91",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - Kelly (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Kelly.png?alt=media&token=b95183ec-d012-4759-a2b2-1d490b1a2122",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - Desmond (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Desmond.png?alt=media&token=b00ea154-75c5-4449-ab27-93962295d246",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - Cypher33 (Official Poster)",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Cypher33.png?alt=media&token=995e8315-fbd0-4720-8232-c73d0d7e60d5",
            bgColor: "#0cd7a2",
            height: 750
        }, {
            title: "WrestleMania 23 - All Participants",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Alternate.png?alt=media&token=6debcb97-ceb1-4a42-9119-045911cc41c8",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 23 - Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Match.png?alt=media&token=30fb7275-7e45-43ad-84e6-3d8612abfbdd",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 23 - Official Video",
            bgVideo: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_MatchVideo.mp4?alt=media&token=d8dfe879-27c1-4000-ad40-a113e2f156c3",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 23 - Match Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM23_Winner.png?alt=media&token=10cef56b-0d3a-4be7-aeff-fe56c5ccabe6",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 22",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6489d93d-1d2e-42c2-8176-7feb024b6168/d9st436-ffceaba9-9ce1-4650-8b03-a26b47ffa5b6.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY0ODlkOTNkLTFkMmUtNDJjMi04MTc2LTdmZWIwMjRiNjE2OFwvZDlzdDQzNi1mZmNlYWJhOS05Y2UxLTQ2NTAtOGIwMy1hMjZiNDdmZmE1YjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.EpQx-cP4hrh9pmpnjz7sihLLog_jc5QnmDtJLgD43SE",
        section: [{
            title: "WrestleMania 22 - Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM22_Match.jpg?alt=media&token=5dc63134-7056-4e1f-8dd0-698a24a45886",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 22 - Final Standings",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM22_FinalStandings.jpg?alt=media&token=cae58d76-7185-4a2a-aec5-82ab0a008ade",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 22 - Match Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM22_Winner.jpg?alt=media&token=217149c6-e00a-48f6-8379-66f800bf2b69",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 20",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6da3cacc-4e5e-40b7-acc3-a313a9fb22b6/dd2kcup-25bd8361-7d24-42ed-a689-2eaed313c330.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZkYTNjYWNjLTRlNWUtNDBiNy1hY2MzLWEzMTNhOWZiMjJiNlwvZGQya2N1cC0yNWJkODM2MS03ZDI0LTQyZWQtYTY4OS0yZWFlZDMxM2MzMzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.bKWbZXjFCh_vukdneCFATFu1reONOYP-CZw8YzisRgo",
        section: [{
            title: "WrestleMania 20 - Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM20_Match.jpg?alt=media&token=ce98e8ba-d73b-4ce5-8bdb-8996371f0f3a",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 20 - Final Standings",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM20_Standings.jpg?alt=media&token=83838c15-9cb0-4f9c-bc10-28dffbb21595",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 20 - Match Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM20_Winner.jpg?alt=media&token=a14012fb-5920-4fa0-ae6d-8b7fb432ba9e",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 18",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/88e30824-3c9a-4957-b6ab-394cb783aa20/dawz0m3-ea587699-7e03-42c6-94f4-a146c0f7da40.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg4ZTMwODI0LTNjOWEtNDk1Ny1iNmFiLTM5NGNiNzgzYWEyMFwvZGF3ejBtMy1lYTU4NzY5OS03ZTAzLTQyYzYtOTRmNC1hMTQ2YzBmN2RhNDAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.McvyGW3AklKobMFlu15tQtG6H2lN26Mnn88wEe2vuzA",
        section: [{
            title: "WrestleMania 18 - Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM18_Match.jpg?alt=media&token=f843feb1-178e-4c04-a85f-0b91e175c102",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 18 - Official Poster 2",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM18_Match2.jpg?alt=media&token=8f6e6ce6-cb53-4760-80fa-8c48654eb537",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 18 - Match Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM18_Winner.jpg?alt=media&token=e262b38f-2b33-4b66-91c3-6b6d12d09dd6",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }, {
        title: "WrestleMania 17",
        wmImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f62c2f82-5d9a-4078-b0e7-0a5b1a1646ac/d8fm7k2-fa8f63b3-ee4c-461f-9bd2-cc5455276ecc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y2MmMyZjgyLTVkOWEtNDA3OC1iMGU3LTBhNWIxYTE2NDZhY1wvZDhmbTdrMi1mYThmNjNiMy1lZTRjLTQ2MWYtOWJkMi1jYzU0NTUyNzZlY2MucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0._yBsZdPcCpvcD0g55LvVAowUyB_KmOJMWhgPhoSCzK8",
        section: [{
            title: "WrestleMania 17 - Official Poster",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM17_Match.jpg?alt=media&token=e14b2e84-165f-4ec2-b6c5-03b503cdc736",
            bgColor: "#0cd7a2",
            height: 450
        }, {
            title: "WrestleMania 17 - Match Winner",
            bgImage: "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/wm_gallery%2FWM17_Winner.jpg?alt=media&token=de751279-dd60-4e7f-a5a8-dece84363776",
            bgColor: "#0cd7a2",
            height: 450
        }]
    }];

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            {gallery.map((section, idx) => (
                <Accordion expanded={expanded === idx} onChange={handleChange(idx)}>
                    <AccordionSummary className="tw-border-b-2 tw-border-black-app tw-border-solid" expandIcon={<ExpandMoreIcon />}>
                        <div className="tw-flex tw-items-center tw-justify-around tw-w-full">
                            <Typography className={`tw-font-noto sm:tw-text-2xl tw-text-xs`}>{section.title}</Typography>
                            <img className="tw-h-20 tw-w-32 sm:tw-w-40" src={section.wmImage} alt={section.title} />
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <WrestleMania section={section.section} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}


export default Gallery;
