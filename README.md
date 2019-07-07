# Timeline

A microsite which presents historic event per thematic.


## How use it

The script (script.js) will import data from data.json, you have to edit it to put your data.

#### Event
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
- hash: a short string to define the category of the event

*: The date and the title are required, if they are missing, the event will be ignored.


#### Zone 
Zones have three properties:
- end: an int (positive or negative) which define the year of the end of the zone
- pos: a positive int which define the vertical position of the zone
- label: a string which named the zone

Every properties of the zone object is needed. Note that the pos should be an int.


#### Hatch / diagonal strip zone

Similar to the zone object the strippedZone is draw over the other zone, it has four properties:
- start: an int (positive or negative) which define the year of the begin of the zone
- end: an int (positive or negative) which define the year of the end of the zone
- posFrom: an int or float used to set the begin of zone on vertical axis
- posTo: an int or float used to set the end of zone on vertical axis

Every properties of the strippedZone object are required.

#### Legend

The legend object has only two properties.
- name: A string used to define the title
- symbol: Similar to `event.hash` a hashtag/symbol used to identify category of event


Here is how the data.json looks like.

```json
{
  "zone": [{
      "end": 1150,
      "pos": 1,
      "label": "Zone 1"
  },{
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
      "hash": "F"
   }, {
     "date": 1250,
      "title": "Second event",
      "text": "Second event description",
      "link": "https://domaine.tld/page-name",
      "pos": 2,
      "hash": "S"
   }]
}
```



## How modify it
First clone the repo

`git clone git@github.com:nclslbrn/timeline.git`

Then  you have to install depencencies with npm

`npm install --save-dev`

Only modify stuffs in src with gulp running before starting, go to the folder where gulpfile.js is.

`cd the-path/to-the-local-copy-of-the-repository`

And to run the default task wich make a lot of things.

`gulp`
#### Gulp tasks
- [sass] compile sass 
- [css] minify css
- [pug] compile pug file
- [js] lint javascript files
- [lib] copy data files (data.json) and dependencies (js library like d3.js) from node_modules folder
- [browserSync] inject change or reload your browser with browserSync 

Before upload the dist/ folder, run `gulp build` to load a minify version of script.js and style.css into html header.


### Build with / Thanks

<a href="https://github.com/d3/d3" style="text-decoration: none;">
<img src="https://avatars3.githubusercontent.com/u/1562726?s=400&v=4" width="80">
</a>
&nbsp; &nbsp; 
<a href="https://github.com/gulpjs/gulp" style="text-decoration: none;">
<img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png" width="40">
</a>
&nbsp; &nbsp;
<a href="https://github.com/sass/sass" style="text-decoration: none;">
<img src="http://sass-lang.com/assets/img/styleguide/color-1c4aab2b.png" width="100">
</a>
&nbsp; &nbsp;
<a href="https://github.com/pugjs/pug" style="text-decoration: none;">
<img src="https://camo.githubusercontent.com/a43de8ca816e78b1c2666f7696f449b2eeddbeca/68747470733a2f2f63646e2e7261776769742e636f6d2f7075676a732f7075672d6c6f676f2f656563343336636565386664396431373236643738333963626539396431663639343639326330632f5356472f7075672d66696e616c2d6c6f676f2d5f2d636f6c6f75722d3132382e737667" width="100">
</a>

<a href="https://github.com/Browsersync/browser-sync" style="text-decoration: none;">
<img src="https://raw.githubusercontent.com/BrowserSync/browsersync.github.io/master/public/img/logo-gh.png" width="100">
</a>