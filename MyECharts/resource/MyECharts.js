//各种图形需要的数据结构：
// 
//pie图：
/* [
    { name: 'Firefox', value: 45.0 },
    { name: 'IE', value: 26.8 },
    { name: 'Safari', value: 8.5 },
    { name: 'Opera', value: 6.2 },
    { name: '其他', value: 0.7 }];

  Line图、Bar图：
[
    { group: 'Beijing', name: '1月', value: 10 },
    { group: 'Beijing', name: '2月', value: 15 },
    { group: 'Beijing', name: '3月', value: 12 },
    { group: 'Beijing', name: '4月', value: 14 },
    { group: 'Tokyo', name: '1月', value: 12 },
    { group: 'Tokyo', name: '2月', value: 15 },
    { group: 'Tokyo', name: '3月', value: 2 },
    { group: 'Tokyo', name: '4月', value: 14 }];

//散点图
        var dataAll = [
        [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
        ],
        [
            [10.0, 9.14],
            [8.0, 8.14],
            [13.0, 8.74],
            [9.0, 8.77],
            [11.0, 9.26],
            [14.0, 8.10],
            [6.0, 6.13],
            [4.0, 3.10],
            [12.0, 9.13],
            [7.0, 7.26],
            [5.0, 4.74]
        ],
        [
            [10.0, 7.46],
            [8.0, 6.77],
            [13.0, 12.74],
            [9.0, 7.11],
            [11.0, 7.81],
            [14.0, 8.84],
            [6.0, 6.08],
            [4.0, 5.39],
            [12.0, 8.15],
            [7.0, 6.42],
            [5.0, 5.73]
        ],
        [
            [8.0, 6.58],
            [8.0, 5.76],
            [8.0, 7.71],
            [8.0, 8.84],
            [8.0, 8.47],
            [8.0, 7.04],
            [8.0, 5.25],
            [19.0, 12.50],
            [8.0, 5.56],
            [8.0, 7.91],
            [8.0, 6.89]
        ]
        ];

    */
/*
2017-04-08，创建
*/

//判断数组中是否包含某个元素
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var MyECharts = {
    //格式化数据
    ChartDataFormate: {
        FormateNOGroupData: function (data) {
            var categories = [];
            var datas = [];
            for (var i = 0; i < data.length; i++) {
                categories.push(data[i].name || '');
                temp_series = { value: data[i].value || 0, name: data[i].name };
                datas.push(temp_series);
            }
            return { category: categories, data: datas };
        },
        //处理分组数据，数据格式：group：XXX，name：XXX，value：XXX用于折线图、柱形图（分组，堆积）
        //参数：数据、展示类型
        FormatGroupData: function (data, type) {
            var groups = new Array();
            var names = new Array();
            var series = new Array();
            for (var i = 0; i < data.length; i++) {
                if (!groups.contains(data[i].group)) {
                    groups.push(data[i].group);
                }
                if (!names.contains(data[i].name)) {
                    names.push(data[i].name);
                }
            }
            for (var i = 0; i < groups.length; i++) {
                var temp_series = {};
                var temp_data = new Array();
                for (var j = 0; j < data.length; j++) {
                    for (var k = 0; k < names.length; k++)
                        if (groups[i] == data[j].group && data[j].name == names[k])
                            temp_data.push(data[j].value);
                    }
                    temp_series = { name: groups[i], type: type, data: temp_data };
                    series.push(temp_series);
                }
                return { legend: groups,category: names, series: series };
            }
        },
    //生成图形
    ChartOptionTemplates: {
        //柱状图
        Bar: function (title, subtext, data) {
            var datas = MyECharts.ChartDataFormate.FormatGroupData(data, 'bar');
            var option = {
                title: {
                    text: title || '',
                    subtext: subtext || ''
                },
                legend: {
                    data:datas.legend
                },
                tooltip: {
                	 trigger: 'axis'
                },
                calculable : true,
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                xAxis: [
                {
                    type: 'category',
                    data: datas.category
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ],
                series: datas.series
            };
            return option;
        },
        //折线图
        Line: function (title, subtext, data) {
            var datas = MyECharts.ChartDataFormate.FormatGroupData(data, 'line');
            var option = {
                title: {
                    text: title || '',
                    subtext: subtext || ''
                },
                legend: {
                    data:datas.legend
                },
                tooltip: {
                    show: true
                },
                xAxis: [
                {
                    type: 'category',
                    data: datas.category
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ],
                series: datas.series
            };
            return option;
        },
        //饼图
        Pie: function (title, subtext, data) {
            var datas = MyECharts.ChartDataFormate.FormateNOGroupData(data);
            var option = {
                title: {
                    text: title || '',
                    subtext: subtext || ''
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: datas.category
                },
                series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: datas.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
                ]
            };
            return option;
        },
        //散点图
        Scatter: function (title, subtext, data) {
            var markLineOpt = {
                animation: false,
                label: {
                    normal: {
                        formatter: 'y = 0.5 * x + 3',
                        textStyle: {
                            align: 'right'
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                tooltip: {
                    formatter: 'y = 0.5 * x + 3'
                },
                data: [[{
                    coord: [0, 3],
                    symbol: 'none'
                }, {
                    coord: [20, 13],
                    symbol: 'none'
                }]]
            };


            var option = {
                title: {
                    text: 'Anscombe\'s quartet',
                    x: 'center',
                    y: 0
                },
                grid: [
                {x: '7%', y: '7%', width: '38%', height: '38%'},
                {x2: '7%', y: '7%', width: '38%', height: '38%'},
                {x: '7%', y2: '7%', width: '38%', height: '38%'},
                {x2: '7%', y2: '7%', width: '38%', height: '38%'}
                ],
                tooltip: {
                    formatter: 'Group {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: 0, max: 20},
                    {gridIndex: 1, min: 0, max: 20},
                    {gridIndex: 2, min: 0, max: 20},
                    {gridIndex: 3, min: 0, max: 20}
                ],
                yAxis: [
                    {gridIndex: 0, min: 0, max: 15},
                    {gridIndex: 1, min: 0, max: 15},
                    {gridIndex: 2, min: 0, max: 15},
                    {gridIndex: 3, min: 0, max: 15}
                ],
                series: [
                {
                    name: 'I',
                    type: 'scatter',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: data[0],
                    markLine: markLineOpt
                },
                {
                    name: 'II',
                    type: 'scatter',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data[1],
                    markLine: markLineOpt
                },
                {
                    name: 'III',
                    type: 'scatter',
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    data: data[2],
                    markLine: markLineOpt
                },
                {
                    name: 'IV',
                    type: 'scatter',
                    xAxisIndex: 3,
                    yAxisIndex: 3,
                    data: data[3],
                    markLine: markLineOpt
                }
                ]
            };
            return option;
        }
    },
    //图形展示
    //参数：图形option、图形显示区域id
    RenderChart: function (option, containerId) {
        var container = eval("document.getElementById('" + containerId + "');");//获取图形显示区域
        var myChart = echarts.init(container);
        myChart.setOption(option);// 为echarts对象加载数据 
    }
};