var gulp = require('gulp');


var del = require('del');
var KarmaServer = require('karma').Server;
var livereload = require('gulp-refresh');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('gulp-tslint-stylish');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');

var paths = {
    scripts: ['src/MessageManager.ts'],
    tests: ['src/MessageManager.spec.ts']
}

gulp.task('scripts', ['tslint'], function () {
    return gulp.src(paths.scripts)
        //compile typescript into javascript
        .pipe(ts({
            declarationFiles: false,
            removeComments: false,
            sortOutput: true
        })).js
        // ignore the code inside the iife parameters
        .pipe(replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2'))
        // ignore the extends code that typescript writes from istanbul
        .pipe(replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */'))
        // initialize the sourcemaps AFTER the typescript has been compiled
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('dist'))
        .pipe(rename('MessageManager.min.js'))
        .pipe(uglify({ mangle: true, compress: { drop_debugger: false } }))
        // write the sourcemaps
        .pipe(sourcemaps.write('./', { addComment: true }))
        // write the uglified file
        .pipe(gulp.dest('dist'));
});

gulp.task('tslint', function () {
    var deleted = false;
    // errorReporter = function (output, file, options) {
    //     //if we found errors, delete the result data. we want to enforce that all tslint errors are handled
    //     if (output.length > 0) {
    //         if (deleted === false) {
    //             del(['dist']);
    //             console.error('There were tslint errors. dist folder has been deleted');
    //         }
    //         deleted = true;
    //     }
    // };

    return gulp.src(paths.scripts.concat(paths.tests))
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: true
        }))
    // .pipe(tslint.report(errorReporter, { emitError: false }))
});


gulp.task('watch', ['default'], function () {
    gulp.watch(paths.scripts, ['scripts']);
    livereload.listen({
        port: 35729,
        quiet: true
    });
    gulp.watch(['dist/MessageManager.js']).on('change', livereload.changed);
});

function getKarmaConf() {
    var preprocessors = {
    };
    preprocessors[paths.tests] = ['typescript'];
    var conf = {
        basePath: '',
        frameworks: ['jasmine'],
        files: ['dist/MessageManager.js'].concat(paths.tests),
        preprocessors: preprocessors,
        reporters: ['mocha', 'coverage'],
        port: 9876,
        colors: true,
        autoWatch: true,
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        browsers: ['Chrome'],
        singleRun: false
    };
    return conf;
}

gulp.task('test', ['watch'], function (done) {
    var conf = getKarmaConf();
    conf.preprocessors['dist/MessageManager.js'] = ['coverage'];
    new KarmaServer(conf, done).start();
});

gulp.task('test-debug', ['watch'], function (done) {
    var preprocessors = {};
    preprocessors[paths.tests] = ['typescript'];
    new KarmaServer(getKarmaConf(), done).start();
});

gulp.task('default', ['scripts']);
