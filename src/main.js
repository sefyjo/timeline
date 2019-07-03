const width = 6000,
  height = 1080,
  eventsWidth = 100;

let timeline = document.getElementById('timeline');
let zones = document.getElementById('timeline--zones');
let events = document.getElementById('timeline--events');

if (timeline && zones) {

  let zoneElements = zones.getElementsByClassName('zone');
  let totalZone = zoneElements.length;
  let zoneHeight = height / totalZone;
  let colors = ["rgb(214, 229, 242)", "rgb(140, 149, 153)"]
  let stepFactor = 1 / (totalZone - 1);

  colors[0] = colors[0].match(/\d+/g).map(Number);
  colors[1] = colors[1].match(/\d+/g).map(Number);

  for (let z = totalZone - 1; z >= 0; z--) {

    let currentColor = interpolateColor(
      colors[0],
      colors[1],
      stepFactor * z
    );

    zoneElements[z].style.backgroundColor = 'rgb(' + currentColor + ')';
    zoneElements[z].style.height = (zoneHeight * z + 1) + 'px';
    zoneElements[z].style.width = width + 'px';
    zoneElements[z].style.zIndex = totalZone - z;
  }
}

if (timeline && events) {

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