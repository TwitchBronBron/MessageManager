var gulp = require('gulp');

var concat = require('gulp-concat');
var ignore = require('gulp-ignore');
var merge = require('merge2');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('clean', async function () {
    await del([
        'dist/**/*',
        'src/**/*.{d.ts,js}'
    ]);
});

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

gulp.task('build', gulp.parallel('build-es2015', 'build-umd'));

gulp.task('default', gulp.parallel('build'));