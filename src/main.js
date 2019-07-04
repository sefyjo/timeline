let timeline = document.getElementById('timeline');
let svgRoot = document.getElementById('timeline--zones');
let zones = document.getElementById('zone-group');
let events = document.getElementById('timeline--events');

if (timeline && zones && events) {

    const width = parseInt(svgRoot.getAttribute('width')),
        height = parseInt(svgRoot.getAttribute('height')),
        startTime = parseInt(timeline.getAttribute('data-start')),
        endTime = parseInt(timeline.getAttribute('data-end')),
        eventsWidth = 100;

    let labelCopy = [];
    let zoneElements = zones.getElementsByClassName('zone');
    const totalZone = zoneElements.length;
    const duration = endTime - startTime;
    let zoneHeight = Math.round(height / totalZone);
    let colors = ["rgb(140, 149, 153)", "rgb(214, 229, 242)"]
    let stepFactor = 1 / totalZone;
    document.body.style.backgroundColor = colors[0];

    colors[0] = colors[0].match(/\d+/g).map(Number);
    colors[1] = colors[1].match(/\d+/g).map(Number);

    /**
     * ZONES
     */
    for (let z = 0; z < totalZone; z++) {

        let polygon = zoneElements[z].getElementsByTagName("polygon")[0];
        let label = zoneElements[z].getElementsByTagName("text")[0];

        let end = parseInt(zoneElements[z].getAttribute('data-end'));
        let zoneY = yScale(z, totalZone, height);

        label.setAttribute('transform', 'translate(0,' + zoneY + ')');
        label.setAttribute('dy', (zoneHeight / 2) + 'px');

        labelCopy.push(label);
        zoneElements[z].removeChild(label);

        let polyX = xScale(end, duration, width, startTime);
        let polyY = yScale(z, totalZone, height);

        let polyPoints = [
            [0, 0],
            [0, polyY],
            [0, polyY + zoneHeight],
            [polyX - zoneHeight, polyY + zoneHeight],
            [polyX, polyY],
            [polyX, 0]
        ];
        let points = polyPoints.join(' ');


        let currentColor = interpolateColor(
            colors[0],
            colors[1],
            stepFactor * z
        );
        polygon.setAttribute('fill', 'rgb(' + currentColor + ')');
        polygon.setAttribute('points', points);

    }

    let axis = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
    );
    axis.setAttribute('id', 'year-axis');

    /**
     * X YEAR AXIS
     */

    for (let y = startTime; y <= endTime; y += 100) {

        let yearXpos = xScale(y, duration, width, startTime);
        let yearYpos = 10;

        let yearGroup = document.createElementNS(
            'http://www.w3.org/2000/svg', 'g'
        );
        yearGroup.classList.add('year');
        yearGroup.setAttribute('transform', 'translate(' + yearXpos + ',' + yearYpos + ')');

        let yearLabel = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'text'
        );

        yearLabel.innerHTML = y;

        let yearLine = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line'
        );
        yearLine.setAttribute('x1', 0);
        yearLine.setAttribute('y1', yearYpos);
        yearLine.setAttribute('x2', 0);
        yearLine.setAttribute('y2', height);

        yearGroup.appendChild(yearLabel);
        yearGroup.appendChild(yearLine);

        axis.appendChild(yearGroup);
    }


    reverse_children(zones);

    let currentYear = new Date().getFullYear();
    let newWidth = xScale(currentYear, duration, width, startTime);
    console.log(currentYear + " -> " + newWidth + "px");

    svgRoot.appendChild(axis);

    // Put zone label on top of vertical year line 
    let zoneLabels = document.createElementNS(
        'http://www.w3.org/2000/svg', 'g'
    );
    zoneLabels.setAttribute('id', 'zone-labels-group');
    labelCopy.forEach(function(label) {
        zoneLabels.appendChild(label);
    });

    svgRoot.appendChild(zoneLabels);

    /**
     * EVENT
     */
    events.style.width = width + 'px';
    events.style.height = height + 'px';
    let eventList = events.getElementsByClassName('event');
    for (let e = 0; e < eventList.length; e++) {

        let event = eventList[e];
        let date = parseInt(event.getAttribute('data-date'));
        let pos = parseInt(event.getAttribute('data-pos'));
        let eventX = xScale(date, duration, width, startTime);
        let eventY = yScale(pos, totalZone, height) - (zoneHeight / 2);

        event.style.left = eventX + 'px';
        event.style.top = eventY + 'px';
        console.log('event n°' + e + 'date: ' + date + ' [' + eventX + ':' + eventY + ']');
    }

}

function xScale(year, duration, width, startTime) {

    let computedYear = null;
    if (year < 0) {
        computedYear = (startTime - year) * -1;
    } else {
        computedYear = year + (startTime * -1);
    }

    let factor = computedYear / duration; //cross product
    let logarithm = (factor * width) * .00001 * (factor * 100000);
    let x = Math.round(logarithm);
    return x;
}

function yScale(pos, totalZone, height) {

    let y = Math.round((pos / totalZone) * height);
    return y;
}

function reverse_children(element) {
    for (var i = 1; i < element.childNodes.length; i++) {
        element.insertBefore(element.childNodes[i], element.firstChild);
    }
}

function interpolateColor(color1, color2, factor) {

    if (arguments.length < 3) {
        factor = 0.5;
    }
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(
            result[i] + factor * (color2[i] - color1[i])
        );
    }
    return result;
};