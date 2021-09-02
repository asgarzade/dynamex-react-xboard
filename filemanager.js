const fs = require('fs-extra');
const path = require('path');

const DJANGO_APP_DIR = path.join('..', '..', 'app', 'xboard', 'templates', 'xboard');
const BUILD_PATH = path.resolve(__dirname, 'build', 'static');
const XBOARD_STATIC_DIST = path.join('..', '..', "app", "xboard", "static", "xboard", "react", "static");
const DJANGO_STATIC_DIST = path.join('..', '..', "app", "static", "xboard", "react", "static");


// With Promises:
fs.ensureDir(XBOARD_STATIC_DIST)
  .then(() => console.log(`success: ${XBOARD_STATIC_DIST}`))
  .catch(err => console.error(err))

  fs.ensureDir(DJANGO_STATIC_DIST)
  .then(() => console.log(`success: ${DJANGO_STATIC_DIST}`))
  .catch(err => console.error(err))

// Async with promises:
fs.copy(BUILD_PATH, XBOARD_STATIC_DIST)
  .then(() => console.log(`success copy: ${BUILD_PATH}`))
  .catch(err => console.error(err))

// Async with promises:
fs.copy(BUILD_PATH, DJANGO_STATIC_DIST)
  .then(() => console.log(`success copy: ${BUILD_PATH}`))
  .catch(err => console.error(err))