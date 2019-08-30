# Timeline

A microsite which presents historic event per thematic.


## How use it

The script (script.js) will import data from data.json, you have to edit it to put your data.

### Event
To add event on the timeline you have to define objects into the event array.
`"event": [
  {event object},
  {event object},
  ...
] `

The event object has six properties:
- date: an int (positive or negative) which define the year of the event *
- title: a string *
- text: another string which can be larger than the title
- link: a string `"url"` or an array of string `["url", "url"...]`
- pos: a positive int or float which define the vertical position according to the correspoding zone of the event
- hash: an array string to define the category of the event `["A", "B"]` 

*: The date and the title are required, if they are missing, the event will be ignored.


### Zone 
Zones have three properties:
- start: an int (positive or negative) which define the year of the begin of the zone
- end: an int (positive or negative) which define the year of the end of the zone
- pos: a positive int which define the vertical position of the zone
- label: a string which named the zone

Every properties of the zone object is needed. Note that the pos should be an int.


### Hatch / diagonal strip zone

Similar to the zone object the strippedZone is draw over the other zone, it has four properties:
- start: an int (positive or negative) which define the year of the begin of the zone
- end: an int (positive or negative) which define the year of the end of the zone
- posFrom: an int or float used to set the begin of zone on vertical axis
- posTo: an int or float used to set the end of zone on vertical axis

Every properties of the strippedZone object are required.

### Legend

The legend object has only two properties.
- name: A string used to define the title
- symbol: Similar to `event.hash` a hashtag/symbol used to identify category of event


Here is how the data.json looks like.

```json
{
  "zone": [{
      "start": -500,
      "end": 1150,
      "pos": 1,
      "label": "Zone 1"
  },{
      "start": 500,
      "end": 1250,
      "pos": 2,
      "label": "Zone 2"
  }],
  "strippedZone": [{
      "start": 1155,
      "end": 1245,
      "posFrom": 1,
      "posTo": 2

  }],
  "legend": [{
      "name": "First theme",
      "symbol": "F"
  }, {
      "name": "Second theme",
      "symbol": "S"
  }],
  "event": [{
      "date": 1150,
      "title": "First event",
      "text": "First event description",
      "link": "https://domaine.tld/page-name",
      "pos": 1,
      "hash": ["F"]
   }, {
     "date": 1250,
      "title": "Second event",
      "text": "Second event description",
      "link": "https://domaine.tld/page-name",
      "pos": 2,
      "hash": ["S"]
   }]
}
```



## How modify it
First clone the repo:

`git clone git@github.com:nclslbrn/timeline.git`

Then you have to install depencencies with npm:

`npm install --save-dev`

Only modify stuffs in src with gulp running before starting, go to the folder where gulpfile.js is:

`cd the-path/to-the-local-copy-of-the-repository`

And to run the default task wich make a lot of things.

`gulp`
### Gulp tasks
- [sass] compile sass 
- [css] minify css
- [pug] compile pug file
- [js] lint javascript files
- [lib] copy data files (data.json) and dependencies (js library like d3.js) from node_modules folder
- [browserSync] inject change or reload your browser with browserSync 

Before upload the dist/ folder, run `gulp build --prod` to load a minify version of script.js and style.css into html header.

### First year of the timeline
[`start`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/script.js#L6) is used to define the first year of the timeline, it could be helpfull to create empty zone before the start of a zone.

### Background colors
[`colors`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/script.js#L7) is an array of two colors which define the colors of first and the last zone (and strippedZone), the script create intepolated colors (kind of gradient) between.

For the hashtag colors, you have to setup them into Sass. Sass will create colors automaticly with rotating the hue of the [`$color-start`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/style.scss#L15).

### Height and width
[`width`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/script.js#L4) define the width (in pixels) of the timeline.

[`height`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/script.js#L5) is used to defined the height of the pixels (in pixels) but the real height will be bigger due to top margin and the size of the last zone.


### Time modular scale
[`steps`](https://github.com/nclslbrn/timeline/blob/0b977633ee76336096f779654b60989fb9373b5b/src/script.js#L27) is an array which define interval between same width periods. You can use it to reduce empty space (no event) and add space between event. 

### Foreground colors / hashtags colors
[`$color-start`](https://github.com/nclslbrn/timeline/blob/eef8503d5074b809341e504ee021a01d241bac67/src/style.scss#L9) is used as start to determine every hastags colors, SASS will compute a 360deg turn on the chromatic specter with iterating the hue of 360deg divided by the number of [`$hashtags`](https://github.com/nclslbrn/timeline/blob/eef8503d5074b809341e504ee021a01d241bac67/src/style.scss#L6).

# Build with / Thanks

[![D3.js](https://avatars1.githubusercontent.com/u/1562726?s=200&v=4)](https://github.com/d3/d3)
[![Gulp.js](https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/gulp/gulp.png)](https://github.com/gulpjs/gulp)
[![SASS](https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sass/sass.png)](https://github.com/sass/sass)
[![Babel](https://raw.githubusercontent.com/github/explore/cb39e2385dfcec8a661d01bfacff6b1e33bbaa9d/topics/babel/babel.png)](https://github.com/babel/babel)
[![Pug](https://avatars0.githubusercontent.com/u/9338635?s=200&v=4)](https://github.com/pugjs/pug)
[![BrowserSync](https://avatars3.githubusercontent.com/u/10654171?s=200&v=4)](https://github.com/Browsersync/browser-sync)
[![NPM](https://avatars0.githubusercontent.com/u/6078720?s=200&v=4)](https://github.com/npm/cli)
--------