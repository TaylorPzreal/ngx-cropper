const gulp = require('gulp');
const gulpCopy = require('gulp-copy');

gulp.task('copy-css', async () => {
  const sourceFiles = ['./src/*.css'];
  const destination = 'dist/';

  await gulp.src(sourceFiles).pipe(gulpCopy(destination, {prefix: 1}));
});

gulp.task('default', ['copy-css']);
