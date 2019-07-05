# Timeline

A microsite for presenting historic event per thematic.
### How use it

coming soon...


### How modify it
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