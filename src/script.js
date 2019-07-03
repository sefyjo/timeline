// Get the data
d3.json("data.json").then(function (data) {

    var timeScaleDate = [];
    var timeScaleValue = [];

    for (var e = 0; e < data.event.length; e++) {
        timeScaleDate.push(data.event[e].date);
        timeScaleValue.push(e * e);
    }
    var width = 6000,
        height = 1280,
        start = -6500,
        colors = ['#d6e5f2', '#8c9599'],
        zoneHeight = height / data.zone.length,
        zoneCornerWidth = zoneHeight,
        circleSize = 6,
        eventWidth = 84,
        zoneMinX = start,
        zoneMaxX = d3.max(data.zone, function (d) {
            return d['end'];
        }),
        eventMinX = d3.min(data.event, function (d) {
            return d['date'];
        }),
        eventMaxX = d3.max(data.event, function (d) {
            return d['date'];
        }),
        globalMinX = Math.min(zoneMinX, eventMinX),
        globalMaxX = Math.max(zoneMaxX, eventMaxX) + 500;

    var xScale = d3.scaleLinear()
        .domain([])
        .range([0, width]);

    var yScale = d3.scaleBand()
        .domain(data.zone.map(d => d.pos))
        .range([0, height]);

    var xAxis = d3.axisTop(xScale).tickSize(height);
    var colorInterpolation = d3.quantize(d3.interpolateHcl(colors[0], colors[1]), data.zone.length);

    var zoneX = function (d, i) {
            return xScale(start);
        },
        zoneY = function (d) {
            return yScale(d.pos);
        },
        zoneW = function (d, i) {
            return xScale(d.end) - xScale(start)
        },
        zoneH = zoneHeight;

    var polyZone = function (d, i) {
        return [
            [
                0,
                0
            ],
            [
                0,
                yScale(d.pos)
            ],
            [
                0,
                yScale(d.pos) + zoneHeight
            ],
            [
                xScale(d.end) - zoneCornerWidth,
                yScale(d.pos) + zoneHeight
            ],
            [
                xScale(d.end),
                yScale(d.pos)
            ],
            [
                xScale(d.end),
                0
            ]
        ];
    };

    var eventX = function (d, i) {
            return xScale(d['date']);
        },
        eventY = function (d) {
            return yScale(d.pos) + zoneHeight / 2;
        };

    var chart = d3.select('.timeline')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    // Add zones
    var zone = chart.selectAll('.timeline-zone')
        .data(data.zone.reverse())
        .enter().append('g')
        .classed('timeline-zone', true);

    var poly = zone.append('polygon')
        .attr('x', zoneX)
        .attr('y', zoneY)
        .attr('points', polyZone)
        .style('fill', function (d, i) {
            return colorInterpolation[i];
        });

    // Add x axis
    chart.append("g")
        .attr("class", "axis axis-x");

    chart.select('.axis-x')
        .attr("transform", "translate(0," + (height + 16) + ")")
        .call(xAxis);

    var label = zone.append('text')
        .attr('x', 8)
        .attr('y', zoneY)
        .attr('transform', 'translate(0, ' + zoneHeight / 2 + ')')
        .attr('dy', '.35em')
        .text(function (d, i) {
            return d.label;
        });

    var event = chart.selectAll('.timeline-event')
        .data(data.event)
        .enter().append('g')
        .classed('timeline-event', true);

    var dot = event.append('circle')
        .attr('cx', eventX)
        .attr('cy', eventY)
        .attr('r', circleSize);

    var info = event.append('text')
        .attr('x', eventX)
        .attr('y', eventY)
        .attr('transform', 'translate(6,6)')
        .attr('dy', '.35em')
        .text(function (d) {
            return d.label;
        }).call(wrap, eventWidth);


});


function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null)
            .append("tspan")
            .attr("x", text.attr('x'))
            .attr("y", y)
            .attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", text.attr('x'))
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}