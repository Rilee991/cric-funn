import React, { useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse, Divider } from '@material-ui/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Frozen";
import * as d3 from 'd3-shape';

const PointsTimeline = (props) => {
    const { data = [], username = "Series" } = props;
    const series1Ref = useRef(null);
    const series2Ref = useRef(null);
    const series3Ref = useRef(null);
    const xAxisRef = useRef(null);

    useEffect(() => {
        const root = am5.Root.new("chartdiv");
    
        root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root), am5themes_Frozen.new(root)]);
    
        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout,
        }));

        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));
        cursor.lineY.set("visible", false);

        // Create X-axis
        const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            // baseInterval: {
            //   timeUnit: "day",
            //   count: 1
            // },
            renderer: am5xy.AxisRendererX.new(root, {
              minGridDistance: 40,
              stroke: "#fff",
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        xAxis.get("renderer").labels.template.setAll({
            fill: am5.color("#fff")
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
            fill: am5.color("#fff")
        });

        const yAxisLabel = am5.Label.new(root, {
            rotation: -90,
            text: "Score",
            y: am5.p50,
            centerX: am5.p50,
            fill: am5.color("#fff")
            //x: am5.p0,
            //centerY: am5.p0
        });

        yAxis.children.unshift(yAxisLabel);

        const series = chart.series.push(am5xy.LineSeries.new(root, {
            name: username.toUpperCase(),
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "points",
            valueXField: "match",
            curveFactory: d3.curveNatural
        }));

        series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.2
        });

        series.bullets.push(function () {
            return am5.Bullet.new(root, {
              locationY: 0,
              sprite: am5.Circle.new(root, {
                radius: 2,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
                fill: series.get("fill")
              })
            });
        });
        
        const tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
        tooltip.label.set("text", "Score: {valueY}");
        
        
        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        // chart.set("scrollbarX", am5.Scrollbar.new(root, {
        //     orientation: "horizontal"
        // }));

        series.data.setAll(data);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
    
        // Create series
        // const series1 = chart.series.push(
        //     am5xy.ColumnSeries.new(root, {
        //         name: "Series",
        //         xAxis: xAxis,
        //         yAxis: yAxis,
        //         valueYField: "value1",
        //         categoryXField: "category"
        //     })
        // );
    
        // const series2 = chart.series.push(
        //     am5xy.ColumnSeries.new(root, {
        //         name: "Series",
        //         xAxis: xAxis,
        //         yAxis: yAxis,
        //         valueYField: "value2",
        //         categoryXField: "category"
        //     })
        // );
    
        // const series3 = chart.series.push(
        //     am5xy.SmoothedXYLineSeries.new(root, {
        //         name: "Line Series",
        //         xAxis: xAxis,
        //         yAxis: yAxis,
        //         valueYField: "value3",
        //         valueXField: "match",
        //         fill: am5.color("#213555"),
        //         stroke: am5.color("#213555"),
        //         minDistance: 0
        //     })
        // );

        // series3.strokes.template.setAll({
        //     strokeWidth: 3,
        //     strokeDasharray: [10,5]
        // });
        // series3.fills.template.setAll({
        //     fillOpacity: 1,
        //     visible: true
        // });
    
        // Add legend
        const legend = chart.children.push(am5.Legend.new(root, {
            x: am5.percent(50),
            centerX: am5.percent(50),
        }));

        legend.labels.template.set("fill", "#fff");

        // // yAxis.get("renderer").labels.template.setAll({
        // //     fill: am5.color("#fff")
        // // });
        legend.data.setAll(chart.series.values);
    
        // // Add cursor
        // chart.set("cursor", am5xy.XYCursor.new(root, {}));
    
        // xAxisRef.current = xAxis;
        // series1Ref.current = series1;
        // series2Ref.current = series2;
        // series3Ref.current = series3;

        // xAxisRef.current.data.setAll(data);
        // series1Ref.current.data.setAll(data);
        // series2Ref.current.data.setAll(data);
        // series3Ref.current.data.setAll(data);

        // series3.appear(1000);
        // series3.set("curveFactory");
        // chart.appear(2000,200);
    
        return () => {
          root.dispose();
        };
    }, []);

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(44deg, rgb(37, 12, 81), rgb(96, 83, 23))" }}>
                <CardContent style={{ "background": "linear-gradient(44deg, #250c51, #605317)"}} className="tw-rounded-[40px] tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-mono tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{"Scores Timeline"}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
            </CardActionArea>
        </Card>
    );
}

export default PointsTimeline;
