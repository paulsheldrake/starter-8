var gulp = require('gulp');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var prefix = require('gulp-autoprefixer');
var sassGlob = require('gulp-sass-glob');

gulp.task('imagemin', function (done) {
  gulp.src('./images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./images'));
  done();
});

gulp.task('sass', function (done) {
  gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        './node_modules/susy/sass/',
        './node_modules/breakpoint-sass/stylesheets',
        './node_modules/compass-sass-mixins/lib/'
      ],
      errLogToConsole: true,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(sassGlob())
    .pipe(gulp.dest('./css'));
  done();
});

gulp.task('uglify', function(done) {
  gulp.src([
    './node_modules/foundation-sites/dist/js/foundation.js',
    './lib/*.js'
  ])
    .pipe(uglify('main.js'))
    .pipe(gulp.dest('./js'));
  done();
});

gulp.task('watch', gulp.series('sass', 'uglify', function(done){
  livereload.listen();
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./lib/*.js', ['uglify']);
  gulp.watch(['./css/styles.css', './**/*.twig', './js/*.js'], function (files){
      livereload.changed(files)
  });

  done();
}));

gulp.task('default', gulp.series('sass', 'uglify', function(done){
  done();
}));
