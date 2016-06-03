const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

gulp.task('build', () => {
  gulp.src('index.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(rename('listplayer.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('min', () => {
  gulp.src('index.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(rename('listplayer.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['build', 'min'])
