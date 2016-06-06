const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const umd = require('gulp-wrap-umd')
const concat = require('gulp-concat')

gulp.task('build', () => {
  gulp.src(['src/emitter.js', 'src/index.js'])
    .pipe(concat('listplayer.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(umd({ namespace: 'ListPlayer', exports: 'ListPlayer' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('min', () => {
  gulp.src(['src/emitter.js', 'src/index.js'])
    .pipe(concat('listplayer.min.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(umd({ namespace: 'ListPlayer', exports: 'ListPlayer' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['build', 'min'])
