import React, { useEffect } from 'react';
import { Typography, Card, CardActionArea, CardContent, Divider } from '@material-ui/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as d3 from 'd3-shape';
import { isEmpty } from 'lodash';

const PointsTimelineCompare = (props) => {
    const { usersPointsTimeline = [], nodeId, title = "Graph" } = props;

    useEffect(() => {
        if(isEmpty(usersPointsTimeline))  return;

        const root = am5.Root.new(nodeId);
        root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root)]);
    
        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            // maxTooltipDistance: 0,
            pinchZoomX: true,
            layout: root.verticalLayout,
            
        }));

        // Create X-axis
        const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.2,
            renderer: am5xy.AxisRendererX.new(root, {
              minGridDistance: 40,
              stroke: "#fff"
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        xAxis.get("renderer").labels.template.setAll({
            fill: am5.color("#fff")
        });

        xAxis.get("renderer").grid.template.setAll({
            stroke: "grey",
            strokeWidth: 0.5,
            strokeOpacity: 0.5
        });

        const xAxisLabel = am5.Label.new(root, {
            rotation: 0,
            text: "Matches",
            x: am5.p50,
            centerY: am5.p50,
            fill: am5.color("#fff")
        });

        xAxis.children.push(xAxisLabel);
    
        // Create Y-Axis
        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
              stroke: "#fff"
            })
        }));

        yAxis.get("renderer").labels.template.setAll({
            fill: am5.color("#fff"),oversizedBehavior:"fit", maxWidth: 50,
        });

        yAxis.get("renderer").labels.template.adapters.add("text", (text) => {
            if(text == undefined)   return "";

            const score = parseInt(text.replace(/,/g, ''));
            
            if(Math.abs(score) >= 100000) {
                return (score/100000).toFixed(score < 1000000 ? 2 : 1) + "L";
            } else if(Math.abs(score) >= 1000) {
                return (score/1000).toFixed(score < 10000 ? 2 : 1) + "K";
            }

            return score;
        });

        yAxis.get("renderer").grid.template.setAll({
            stroke: "grey",
            strokeWidth: 0.5,
            strokeOpacity: 0.5
        });

        const yAxisLabel = am5.Label.new(root, {
            rotation: -90,
            text: "Score",
            y: am5.p50,
            centerX: am5.p50,
            fill: am5.color("#fff")
        });

        yAxis.children.unshift(yAxisLabel);

        for(const eachUserTimeline of usersPointsTimeline) {
            const series = chart.series.push(am5xy.LineSeries.new(root, {
                name: eachUserTimeline.player.toUpperCase(),
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "points",
                valueXField: "match",
                minDistance: 0,
                curveFactory: d3.curveNatural
            }));
    
            series.fills.template.setAll({
                visible: true,
                fillOpacity: 0
            });

            series.strokes.template.setAll({ strokeWidth: 2 });

            series.data.setAll(eachUserTimeline.journey);
            series.appear(1000);

            const tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
            tooltip.label.set("text", "{name}: {valueY}");
        }

        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));
        cursor.lineY.set("visible", true);
        
        // Add legend
        const legend = chart.children.push(am5.Legend.new(root, {
            x: am5.percent(50),
            centerX: am5.percent(50)
        }));

        legend.labels.template.set("fill", "#fff");

        // When legend item container is hovered, dim all the series except the hovered one
        legend.itemContainers.template.events.on("pointerover", function(e) {
            let itemContainer = e.target;
        
            // As series list is data of a legend, dataContext is series
            let series = itemContainer.dataItem.dataContext;
        
            chart.series.each(function(chartSeries) {
                if (chartSeries != series) {
                    chartSeries.strokes.template.setAll({
                        strokeOpacity: 0.15,
                        stroke: am5.color(0x000000)
                    });
                } else {
                    chartSeries.strokes.template.setAll({
                        strokeWidth: 3
                    });
                }
            })
        })
        
        // When legend item container is unhovered, make all series as they are
        legend.itemContainers.template.events.on("pointerout", function(e) {
            let itemContainer = e.target;
            let series = itemContainer.dataItem.dataContext;
        
            chart.series.each(function(chartSeries) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 1,
                    strokeWidth: 2,
                    stroke: chartSeries.get("fill")
                });
            });
        })

        // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
        legend.data.setAll(chart.series.values);

        chart.appear(1000, 100);

        return () => {
          root.dispose();
        };
    }, [usersPointsTimeline]);

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 tw-w-full tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(179deg, rgb(10, 8, 82), rgb(0, 0, 0))" }}>
                <CardContent style={{ "background": "linear-gradient(179deg, #0a0852, rgb(0 0 0))"}} className="tw-rounded-[40px] tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-noto tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{title}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <div id={nodeId} style={{ width: "100%", height: "500px" }}></div>
            </CardActionArea>
        </Card>
    );
}

export default PointsTimelineCompare;
