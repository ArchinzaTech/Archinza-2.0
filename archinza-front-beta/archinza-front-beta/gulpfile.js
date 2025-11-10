'use strict';
var gulp = require('gulp');
require('dotenv').config()

var config = {
  'accessKeyId': process.env.AWS_ACCESS_KEY,
  'secretAccessKey': process.env.AWS_SECRET_KEY,
  'region': 'ap-south-1',
};

var s3 = require('gulp-s3-upload')(config);

gulp.task('upload-prod', function (done) {
  gulp.src('build/**').pipe(s3({
    Bucket: 'www.archinza.com',
    ACL: 'public-read'
  }));
  return done();
});

gulp.task('upload-dev', function (done) {
  gulp.src('build/**').pipe(s3({
    Bucket: 'appdev.archinza.com',
    ACL: 'public-read'
  }));
  return done();
});
