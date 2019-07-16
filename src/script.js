// Get the data
d3.json('data.json').then(function (data) {

    let width = 8000,
        height = 960,
        start = -7000,
        colors = ['#b4c8da', '#787d80'],
        zoneHeight = (height / data.zone.length),
        zoneCornerWidth = zoneHeight,
        miniTimelineHeight = 64, // need to be set also in style.scss
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
        globalMaxX = Math.max(zoneMaxX, eventMaxX);


    // Set scale interpolation limit 
    const steps = [start, 1350, 1738, 1915, 2000, globalMaxX];
    const stepsWidth = width / (steps.length - 1);
    // Set scale interpolation width
    const stepsValue = [];
    for (let s = 0; s <= width; s += width / (steps.length - 1)) {
        stepsValue.push(s);
    }
    const xScale = d3.scaleLinear()
        .domain(steps)
        .range(stepsValue);

    const yScale = d3.scaleLinear()
        .domain([0, data.zone.length - 1, data.zone.length])
        .range([0, (height - zoneHeight), height]);

    let newHeight = Math.round(height + (zoneHeight * 6)); // I don't know but it works

    let xAxis = d3.axisBottom(xScale)
        .ticks(data.event.length) // read data from event data
        .tickValues(d3.set(data.event.map(function (d) {
            return d.date
        })).values())
        .tickSize(newHeight) // full height line
        .tickFormat(d3.format("d")); // remove comma from thousand delimeter

    let colorInterpolation = d3.quantize(
        d3.interpolateHcl(
            colors[0],
            colors[1]
        ), data.zone.length
    );
    let zoneX = function (d, i) {
            return xScale(d.start);
        },
        zoneY = function (d) {
            return yScale(d.pos);
        },
        zoneW = function (d, i) {
            return xScale(d.end) - xScale(d.start)
        },
        zoneH = zoneHeight;

    // rect with bottom right angle cutted (x - rect height)
    let polyZone = function (d, i) {
        return [
            [
                xScale(d.start),
                0
            ],
            [
                xScale(d.start),
                yScale(d.pos)
            ],
            [
                xScale(d.start),
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
    // distribute event on zones/thematics
    let eventX = function (d, i) {
            return xScale(d['date']);
        },
        eventY = function (d) {
            return yScale(d.pos) + zoneHeight / 2;
        };

    /**
     * TIMEMLINE BACK
     */
    let chartBack = d3.select('#timeline--background')
        .attr('width', width)
        .attr('height', newHeight)
        .append('g');

    // Add zones
    let zone = chartBack.selectAll('.timeline-zone')
        .data(data.zone.reverse())
        .enter().append('g')
        .classed('timeline-zone', true);

    let poly = zone.append('polygon')
        .attr('x', zoneX)
        .attr('y', zoneY)
        .attr('points', polyZone)
        .style('fill', function (d, i) {
            return colorInterpolation[i];
        });
    let zoneSeparator = zone.append('line')
        .attr('x1', 0)
        .attr('y1', zoneY)
        .attr('x2', width)
        .attr('y2', zoneY)
        .attr('stroke', 'rgba(255,255,255,.15)');

    // Add stripped zone
    let strippedZone = chartBack.selectAll('.timeline-stripped-zone')
        .data(data.strippedZone.reverse())
        .enter().append('g')
        .classed('timeline-stripped-zone', true);
    let strip = strippedZone.append('rect')
        .attr('x', function (d, i) {
            return xScale(parseInt(d.start));
        })
        .attr('y', function (d, i) {
            return yScale(parseInt(d.posFrom));
        })
        .attr('width', function (d, i) {
            return xScale(parseInt(d.end) - xScale(parseInt(d.start)));
        })
        .attr('height', function (d, i) {
            return yScale(parseInt(d.posTo)) + zoneHeight;
        })
        .style('mask', 'url(#mask-stripe)')
        .attr('fill', function (d, i) {
            return colorInterpolation[(data.zone.length - 1) - d.posTo];
        });

    // Add x axis
    chartBack.append('g')
        .attr('class', 'axis axis-x');

    chartBack.select('.axis-x')
        .call(xAxis)
        .selectAll('text')
        .attr('y', 4)
        .attr('dy', 0)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90) translate(-20,-7)');

    let label = zone.append('text')
        .attr('x', 8)
        .attr('y', zoneY)
        .attr('transform', 'translate(0, ' + zoneHeight / 2 + ')')
        //.attr('dy', '.35em')
        .text(function (d, i) {
            return d.label;
        });

    /**
     * TIMEMLINE FRONT
     */
    let chartFront = d3.select('#timeline--content')
        .style('width', width)
        .style('height', newHeight); // yes this is very ugly

    let eventsBlocks = [];

    for (let e = 0; e < data.event.length - 1; e++) {

        if (data.event[e].title && data.event[e].date && data.event[e].pos) {

            let event = chartFront.append('div')
                .datum(data.event[e])
                .classed('timeline--content--event', true)
                .style('left', eventX)
                .style('top', eventY);

            let eventContainer = event.append('div')
                .attr('class', 'event-inner');

            // event title
            let title = eventContainer.append('h3')
                .text(function (d) {
                    return d.title;
                });
            // event text
            if (data.event[e].text) {
                let text = eventContainer.append('p')
                    .text(function (d) {
                        if (d.text) {
                            return d.text;
                        }
                    });
            }
            // event hashtag
            if (data.event[e].hash) {
                event.attr('class', 'timeline--content--event hashtag-' + data.event[e].hash);

                let hash = eventContainer.append('span')
                    .attr('class', 'hashtag hastag-' + data.event[e].hash)
                    .style('color', colorInterpolation[data.event[e].pos])
                    .text(data.event[e].hash);
            }
            // event link
            if (data.event[e].link) {

                let links = [];
                if (Array.isArray(data.event[e].link)) {
                    links = data.event[e].link;
                } else {
                    links.push(data.event[e].link);
                }

                for (let l = 0; l < links.length; l++) {

                    let link = eventContainer.append('a')
                        .attr('href', links[l])
                        .on('click', function () {
                            d3.event.preventDefault();
                            return handleEventLinkClick(this);
                        });
                    if (links[l].includes('youtube') || links[l].includes('vimeo')) {

                        let icon = link.append('svg')
                            .attr('class', 'icon icon-play');

                        let use = icon.append('use')
                            .attr('xlink:href', '#icon-play');

                    } else {

                        let icon = link.append('svg')
                            .attr('class', 'icon icon-link2');

                        let use = icon.append('use')
                            .attr('xlink:href', '#icon-link-2');
                    }
                }
            }
        }
    }
    /**
     * Mini timeline
     */

    let mainTimeline = document.getElementById('timeline');

    function drawMiniTimeline() {

        let viewPortWidth = window.innerWidth;

        let miniStepValue = [];
        for (let s = 0; s <= width; s += viewPortWidth / (steps.length - 1)) {
            miniStepValue.push(s);
        }
        let miniZoneHeight = miniTimelineHeight / data.zone.length;

        const miniXScale = d3.scaleLinear()
            .domain(steps)
            .range(miniStepValue);

        const miniYScale = d3.scaleLinear()
            .domain([0, data.zone.length])
            .range([0, miniTimelineHeight]);

        let minichart = d3.select('svg#mini-timeline')
            .attr('width', viewPortWidth)
            .attr('height', miniTimelineHeight)
            .attr('viewBox', '0 0 ' + viewPortWidth + ' ' + miniTimelineHeight);

        let miniZoneGroup = minichart.append('g')
            .attr('class', 'mini-timeline--zone-group');

        let miniZone = miniZoneGroup.selectAll('.timeline-mini-zone')
            .data(data.zone.reverse())
            .enter().append('g')
            .classed('timeline-mini-zone', true);

        let miniRect = miniZone.append('rect')
            .attr('x', function (d, i) {
                return miniXScale(d.start);
            })
            .attr('y', function (d, i) {
                return miniYScale(d.pos) - miniZoneHeight;
            })
            .attr('width', function (d, i) {
                return miniXScale(d.end);
            })
            .attr('height', miniZoneHeight)
            .style('fill', function (d, i) {
                return colorInterpolation[data.zone.length - 1 - i];
            });

        let scrollCursorWidth = (viewPortWidth / width) * viewPortWidth;
        let halfScrollCursorWidth = scrollCursorWidth / 2;
        let scrollCursor = minichart.append('rect')
            .attr('id', 'mini-timeline--scroller')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', scrollCursorWidth)
            .attr('height', miniTimelineHeight)
            .attr('fill', 'steelblue')
            .style('opacity', '.5')
            .call(d3.drag()
                .on('start.interrupt', function () {
                    scrollCursor.interrupt();
                    //console.log('stop')
                })
                .on('start drag', function () {
                    if (d3.event.x < viewPortWidth - halfScrollCursorWidth) {

                        scrollCursor.attr('x', d3.event.x - halfScrollCursorWidth);
                        scrollCursor.attr('fill', 'tomato');

                        let x = (d3.select(this).attr('x') / viewPortWidth) * width;
                        mainTimeline.scrollLeft = document.body.scrollLeft = x;
                    }

                })
                .on('end', function () {
                    scrollCursor.attr('fill', 'steelblue');
                })
            );

        mainTimeline.addEventListener('scroll', function (e) {
            let x = mainTimeline.scrollLeft / width * viewPortWidth;
            scrollCursor.attr('x', x);
        });
    }
    drawMiniTimeline();

    window.onresize = function () {
        let miniTimiline = document.getElementById('mini-timeline');
        while (miniTimiline.lastElementChild) {
            miniTimiline.removeChild(miniTimiline.lastElementChild);
        }
        drawMiniTimeline();
    }

    let legendModal = document.getElementById('legend-modal');
    let legendTitle = document.createElement('h1');
    legendTitle.innerHTML = 'Légende';
    legendModal.childNodes[1].childNodes[3].appendChild(legendTitle);

    for (let l = 0; l < data.legend.length; l++) {

        let container = document.createElement('div');

        let symbol = document.createElement('h2');
        symbol.classList.add('hashtag-' + data.legend[l].symbol);
        symbol.innerHTML = data.legend[l].symbol;

        let name = document.createElement('p');
        name.innerHTML = data.legend[l].name;

        container.appendChild(symbol);
        container.appendChild(name);

        legendModal.childNodes[1].childNodes[3].appendChild(container);
    }
    document.getElementById('toggle-legend').addEventListener('click', function (event) {
        legendModal.classList.add('active');
    });
    document.getElementById('close-the-legend-modal').addEventListener('click', function (event) {
        legendModal.classList.remove('active');
    });


    /**
     * Event link
     */
    function handleEventLinkClick(link) {

        let modal = document.getElementById('link-modal');
        let contentHere = document.getElementById('put-your-content-here');
        let closeButton = document.getElementById('close-the-link-modal');
        // Prevent two iframe (modal not closed and reclisk on link)
        while (contentHere.lastElementChild) {
            contentHere.removeChild(contentHere.lastElementChild);
        }

        let isVideoUrl = convertVideo(link.href);

        let frame = document.createElement('iframe');
        frame.setAttribute('width', '100%');
        frame.setAttribute('height', '100%');
        // Set the content
        if (isVideoUrl != null) {

            frame.setAttribute('src', isVideoUrl);
            frame.setAttribute('allowfullscreen', '');

        } else {

            frame.setAttribute('src', link.href);
        }

        contentHere.appendChild(frame);

        modal.classList.add('active');

        closeButton.addEventListener('click', function (event) {
            event.preventDefault();
            while (contentHere.lastElementChild) {
                contentHere.removeChild(contentHere.lastElementChild);
            }
            modal.classList.remove('active');
        });

    }

    function convertVideo(link) {

        var vimeoPattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
        var youtubePattern = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

        if (vimeoPattern.test(link)) {

            var replacement = '//player.vimeo.com/video/$1';

            var src = link.replace(vimeoPattern, replacement);

            return src;

        }


        if (youtubePattern.test(link)) {

            var replacement = 'http://www.youtube.com/embed/$1';

            var src = link.replace(youtubePattern, replacement);

            return src;

        }
        return null;

    }

});