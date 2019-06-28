var gulp = require('gulp'),
    /*You can see dependancies in the package.json */
    plugins = require('gulp-load-plugins')({
        pattern: '*'
    }),
    fs = require('fs'),
    del = require('del'),
    path = require('path'),
    browserSync = require('browser-sync'),
    modRewrite = require('connect-modrewrite');

/* Paths to Dev and dist environnement for path flexibility*/
var devPaths = {
    base: 'src/',
    tmpl: 'src/index.pug',
    sass: 'src/style.scss',
    styles: 'dist/style.css',
    script: 'src/script.js',
};

var distPaths = {
    base: 'dist/',
    tmpl: 'dist/index.html',
    styles: 'dist/style.css',
    sass: 'dist/',
    script: 'dist/script.js',
};
var additionalFiles = ['node_modules/d3/dist/d3.min.js', 'src/data.json'];

// Browser synchronisation
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: distPaths.base,
            proxy: 'localhost',
            port: 80,
            open: true,
            startPath: 'index.html',
        },
        //  browser: 'Safari'
    });
});

// Compile pug templates to html pages
gulp.task('pug', function() {
    return gulp.src(devPaths.tmpl)
        .pipe(plugins.pug({
            pretty: true,
        }))
        .pipe(plugins.prettify({
            indent_size: 4,
            preserve_newlines: true
        }))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Duplicate main.js file and minify it in the distPath (js/)
gulp.task('js', function() {
    return gulp.src(devPaths.script)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('script.js'))
        .pipe(gulp.dest(distPaths.base))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        //  .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Compile sass main file to a css file in distPath (css/)
gulp.task('sass', function() {
    return gulp.src(devPaths.sass)
        .pipe(plugins.sourcemaps.init(distPaths.base))
        .pipe(plugins.sass({
            includePaths: ['css'],
            onError: browserSync.notify,
            precision: 10,
        }))
        .pipe(plugins.autoprefixer(
            ['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
                cascade: true
            }
        ))
        .pipe(plugins.cssbeautify({
            indent: '  ',
            autosemicolon: true
        }))
        .pipe(plugins.sourcemaps.write(distPaths.base))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Duplicate css files to the distPath (css/main.min.css)
gulp.task('css', function() {
    return gulp.src(distPaths.styles)
        .pipe(gulp.dest(distPaths.base))
        .pipe(plugins.cleanCss({
            compatibility: 'ie8'
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Add lib to js folder into webPath (js/)
gulp.task('lib', function() {
    gulp.src(additionalFiles)
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Remove hidden files
gulp.task('cleanup', function() {
    del('**/.DS_Store');
});

gulp.task('clean', function() {
    del(distPaths.base + '*');
});

gulp.task('default', ['browserSync', 'css', 'pug', 'js', 'sass', 'lib'], function() {
    gulp.watch(devPaths.tmpl, ['pug']);
    gulp.watch(devPaths.script, ['js']);
    gulp.watch(devPaths.sass, ['sass']);
    gulp.watch(distPaths.styles, ['css']);
    gulp.watch(additionalFiles, ['lib']);
    gulp.watch(devPaths.src + '**/.DS_Store', ['clean']);
});