const gulp = require('gulp'),
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
const devPaths = {
    base: 'src/',
    tmpl: ['src/index.pug', "src/pug/*.pug", "src/data.json"],
    sass: 'src/style.scss',
    styles: 'dist/style.css',
    script: 'src/script.js',
};

const distPaths = {
    base: 'dist/',
    tmpl: 'dist/index.html',
    styles: 'dist/style.css',
    sass: 'dist/',
    script: 'dist/script.js',
};


const additionalFiles = [
    'node_modules/d3/dist/d3.min.js',
    'node_modules/d3-ease/dist/d3-ease.min.js',
    'src/data.json'
];

let env = (process.argv[3] == '--prod') ? 'prod' : 'dev';

// Browser synchronisation
gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: distPaths.base,
            proxy: 'localhost',
            port: 80,
            open: true,
            startPath: 'index.html',
        }
    });
});

// Compile pug templates to html pages
gulp.task('pug', () => {
    return gulp.src(devPaths.base + 'index.pug')
        .pipe(plugins.pug({
            pretty: true,
            data: {
                env: env
            }
        }))
        .pipe(plugins.prettify({
            indent_size: 4,
            preserve_newlines: true
        }))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// Duplicate main.js file and minify it in the distPath (js/)
gulp.task('js', () => {
    return gulp.src(devPaths.script)
        //.pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({
            presets: ['@babel/env']
        }))
        //.pipe(gulp.dest(distPaths.script))
        //.pipe(plugins.concat('main.js'))
        .pipe(gulp.dest(distPaths.base))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Compile sass main file to a css file in distPath (css/)
gulp.task('sass', () => {
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
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Duplicate css files to the distPath (css/main.min.css)
gulp.task('css', () => {
    return gulp.src(distPaths.styles)
        .pipe(gulp.dest(distPaths.base))
        .pipe(plugins.cleanCss({
            compatibility: 'ie8',
            debug: true
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
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
gulp.task('lib', () => {
    return gulp.src(additionalFiles)
        .pipe(gulp.dest(distPaths.base))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Remove hidden files
gulp.task('cleanup', () => {
    return del('**/.DS_Store');
});

gulp.task('clean', () => {
    return del(distPaths.base + '*');
});

gulp.task('build', gulp.series(['clean', 'sass', 'js', 'lib'], () => {
    env = 'prod';
    console.log('Environment: ' + env);
    gulp.start('css');
    gulp.start('pug');
}));

gulp.task('default', gulp.series(['browserSync', 'css', 'pug', 'js', 'sass', 'lib'], () => {
    console.log('Environment: ' + env);
    gulp.watch(devPaths.tmpl, ['pug']);
    gulp.watch(devPaths.script, ['js']);
    gulp.watch(devPaths.sass, ['sass']);
    gulp.watch(distPaths.styles, ['css']);
    gulp.watch(additionalFiles, ['lib']);
    gulp.watch(devPaths.src + '**/.DS_Store', ['clean']);
}));