function wrap(text, width) {
    text.each(function() {
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


// Get the data
d3.json("data.json").then(function(data) {

    var width = window.innerWidth,
        height = window.innerHeight / 1.5,
        margin = {
            top: 20,
            right: 30,
            bottom: 50,
            left: 40
        },
        colors = ['#8c9599', '#d6e5f2'],
        zoneHeight = height / data.zone.length,
        zoneCornerWidth = zoneHeight,
        circleSize = 16,
        eventWidth = 84,
        xScale = d3.scaleBand(),
        yScale = d3.scaleBand(),
        xAxis = d3.axisBottom(xScale),
        zoneMinX = d3.min(data.zone, function(d) {
            return d['begin'];
        }),
        zoneMaxX = d3.max(data.zone, function(d) {
            return d['end'];
        }),
        eventMinX = d3.min(data.event, function(d) {
            return d['date'];
        }),
        eventMaxX = d3.min(data.event, function(d) {
            return d['date'];
        }),
        globalMinX = Math.min(zoneMinX, eventMinX),
        globalMaxX = Math.max(zoneMaxX, eventMaxX);

    xScale.domain(d3.range(globalMinX - 4, globalMaxX + 1));
    xScale.rangeRound([0, width]);
    yScale.domain(data.zone.map(d => d.pos)).range([0, height]);

    var colorInterpolation = d3.quantize(d3.interpolateHcl(colors[0], colors[1]), data.zone.length);
    console.log(colorInterpolation);

    var zoneX = function(d, i) {
            return xScale(d['begin']);
        },
        zoneY = function(d) {
            return yScale(d.pos);
        },
        zoneW = function(d, i) {
            return xScale(d['end']) - xScale(d['begin'])
        },
        zoneH = zoneHeight;
    var polyZone = function(d, i) {
        return [
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
            ]
        ];
    };
    var eventX = function(d, i) {
            return xScale(d['date']);
        },
        eventY = function(d) {
            return yScale(d.pos) + zoneHeight / 2;
        };

    var chart = d3.select('.timeline')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.left + margin.right)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add x axis
    chart.append("g")
        .attr("class", "axis axis-x");

    chart.select('.axis-x')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add zones
    var zone = chart.selectAll('.timeline-zone')
        .data(data.zone)
        .enter().append('g')
        .classed('timeline-zone', true);

    var poly = zone.append('polygon')
        .attr('x', zoneX)
        .attr('y', zoneY)
        .attr('points', polyZone)
        .style('fill', function(d, i) {
            return colorInterpolation[i];
        });

    var label = zone.append('text')
        .attr('x', 0)
        .attr('y', zoneY)
        .attr('transform', 'translate(0, ' + zoneHeight / 2 + ')')
        .attr('dy', '.35em')
        .text(function(d, i) {
            return i + " " + d.label;
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
        .attr('transform', 'translate(0, ' + circleSize / 2 + ')')
        .attr('dy', '.35em')
        .text(function(d) {
            return d.label;
        }).call(wrap, eventWidth);


});