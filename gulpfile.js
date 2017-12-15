const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

gulp.task('copy-css', async () => {
  const sourceFiles = ['./src/*.css'];
  const destination = 'dist/';

  await gulp.src(sourceFiles).pipe(gulpCopy(destination, { prefix: 1 }));
});

gulp.task('minify-css', () => {
  const cssList = ['node_modules/cropperjs/dist/cropper.min.css', 'src/ngx-cropper.component.css'];
  return gulp
    .src(cssList)
    .pipe(concat('ngx-cropper.min.css'))
    .pipe(cleanCSS({}))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['minify-css']);
