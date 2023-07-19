import React, { useEffect } from 'react';
import { Typography, Card, CardActionArea, CardContent, Divider } from '@material-ui/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5Percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Micro";
import * as d3 from 'd3-shape';

const BetTimeDistChart = (props) => {
    const { betTimeDist = [], betTimePtsDist = [], username = "Series" } = props;

    useEffect(() => {
        const root = am5.Root.new("betTimeDistChart");
    
        root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root)]);
    
        const chart = root.container.children.push(am5Percent.PieChart.new(root, {
            radius: am5.percent(80),
            innerRadius: am5.percent(25),
            layout: root.verticalLayout
        }));

        const series = chart.series.push(am5Percent.PieSeries.new(root, {
            name: "Bet Count Dist.",
            valueField: "count",
            categoryField: "timePeriod",
            alignLabels: true
        }));

        series.get("colors", [ am5.color(0x68dc76), am5.color(0x6771dc), am5.color(0x6794dc), am5.color(0xb30000) ]);

        series.data.setAll(betTimeDist);
        series.labels.template.setAll({
            text: "{category}",
            textType: "circular",
            inside: false,
            radius: 10
          });


        series.slices.template.setAll({
            stroke: am5.color(0xffffff),
            strokeWidth: 2
        });

        series.labels.template.set("visible", true);
        series.labels.template.set("fill", "#fff");
        series.ticks.template.set("visible", true);
        series.ticks.template.set("fill", "#fff");
        series.labels.template.setAll({fontSize: 18,
            fill: am5.color("#fff"),
            text: "{timePeriod}"});
        series.labels.template.set("text", "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})");

        // const series2 = chart.series.push(am5Percent.PieSeries.new(root, {
        //     name: "Bet Time Pts Dist.",
        //     valueField: "pointss",
        //     categoryField: "timePeriod"
        // }));


        // series2.get("colors", [ am5.color(0x68dc76), am5.color(0x6771dc), am5.color(0x6794dc), am5.color(0xb30000) ]);
          
        // series2.data.setAll(betTimePtsDist);
          
        //   // Configuring slices
        // series2.slices.template.setAll({
        //     stroke: am5.color(0xffffff),
        //     strokeWidth: 2
        // });
          
        //   // Disabling labels and ticks
        // series2.labels.template.set("visible", false);
        // series2.ticks.template.set("visible", false);
        
        // const tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
        // tooltip.label.set("text", "Score: {valueY}");
    
        // Add legend
        const legend = chart.children.push(am5.Legend.new(root, {
            x: am5.percent(50),
            centerX: am5.percent(50),
            // y: am5.percent(95),
            // centerY: am5.percent(0)
            layout: root.horizontalLayout
        }));

        legend.valueLabels.template.adapters.add("text", function(text, target) {
            if (target.dataItem && (target.dataItem.get("valuePercentTotal") < 5)) {
              return "<5%";
            }
            return text;
        });

        legend.labels.template.set("fill", "#fff");
        legend.data.setAll(series.dataItems);

        series.appear();
        chart.appear();
    
        return () => {
          root.dispose();
        };
    }, [betTimeDist]);

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(44deg, rgb(37, 12, 81), rgb(96, 83, 23))" }}>
                <CardContent style={{ "background": "linear-gradient(44deg, #250c51, #605317)"}} className="tw-rounded-[40px] tw-flex tw-items-center tw-justify-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-mono tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{"Bet Points and count Distribution Time Wise"}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <div id="betTimeDistChart" style={{ width: "100%", height: "400px" }}></div>
            </CardActionArea>
        </Card>
    );
}

export default BetTimeDistChart;
