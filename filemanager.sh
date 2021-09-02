#!/usr/bin/env bash

# Any subsequent(*) commands which fail will cause the shell script to exit immediately
set -e

#Default values
CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_PATH="${CURRENT_PATH}/build"
XBOARD_STATIC_DIST="${CURRENT_PATH}/../../app/xboard/static/xboard/react/"
DJANGO_STATIC_DIST="${CURRENT_PATH}/../../app/static/xboard/react/"


function ensure_exists() {
  mkdir -p $XBOARD_STATIC_DIST
  mkdir -p $DJANGO_STATIC_DIST
  #statements
  # mkdir -p dist
}


function copy() {
  #statements
  cp -r ${BUILD_PATH}/static $XBOARD_STATIC_DIST
  cp -r ${BUILD_PATH}/static $DJANGO_STATIC_DIST
}


function clean_up() {
  #statements
  rm -rf ${XBOARD_STATIC_DIST}/*
  rm -rf ${DJANGO_STATIC_DIST}/*
}


ensure_exists
clean_up
copy
