var gulp = require('gulp');

var concat = require('gulp-concat');
var ignore = require('gulp-ignore');
var karma = require('karma');
var merge = require('merge2');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');

// var tsProject = ts.createProject('tsconfig.json', {
//     declaration: true
// });

gulp.task('build-es2015', function () {
    var tsResult = gulp.src([
        'src/MessageManager.ts'
    ]).pipe(ts({
        "module": "es2015",
        "noImplicitAny": true,
        "removeComments": false,
        "preserveConstEnums": true,
        declaration: true
    }));

    return merge(
        tsResult.js.pipe(gulp.dest('./src')),
        tsResult.dts.pipe(gulp.dest('./src'))
    );
});

gulp.task('build-umd', function () {
    var tsResult = gulp.src([
        'src/MessageManager.ts',
        'src/modules.ts'
    ]).pipe(replace('export ', ''))
        .pipe(ts({
            "module": "none",
            "noImplicitAny": true,
            "removeComments": false,
            "preserveConstEnums": true,
            declaration: true
        }));

    var dtsResult = tsResult.dts
        .pipe(ignore.exclude('**/modules.d.ts'))
        .pipe(concat('MessageManager.d.ts'))
        .pipe(gulp.dest('./dist'));

    var jsResult = tsResult.js
        .pipe(concat('MessageManager.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(concat('MessageManager.min.js'))
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

    return merge([dtsResult, jsResult]);
});

gulp.task('test-node', function (done) {
    var MessageManager = require('./dist/MessageManager.js');
    try {
        var mm = new MessageManager();
        done(0);
    } catch (e) {
        done(1);
    }
});

gulp.task('test-browser', function (done) {
    var server = new karma.Server({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/requirejs/require.js',
            'dist/MessageManager.js',
            'src/MessageManager.spec.ts'
        ],
        preprocessors: {
            '**/*.ts': ['typescript']
        },
        typescriptPreprocessor: {
            // options passed to the typescript compiler 
            options: {
                sourceMap: false,
                noResolve: true,
                removeComments: false,
                concatenateOutput: false
            },
            // transforming the filenames 
            transformPath: function (path) {
                return path.replace(/\.ts$/, '.js');
            }
        },
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        autoWatch: true,
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        browsers: ['Chrome'],
        singleRun: true
    }, function (exitCode) {
        done(exitCode);
    });
    server.start();
});

gulp.task('test', ['test-browser', 'test-node']);

gulp.task('build', ['build-es2015', 'build-umd']);

gulp.task('default', ['build']);