const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const lodash = require('lodash');

const DJANGO_APP_DIR = path.join('..', '..', 'app', 'xboard', 'templates', 'xboard');
const DJANGO_TEMP_PATH = path.resolve(DJANGO_APP_DIR, 'react.tmp.html');
const DESTFILE = path.resolve(DJANGO_APP_DIR, 'react.html');
const BUILD_PATH = path.resolve(__dirname, 'build', 'index.html');

console.log(DJANGO_APP_DIR, fs.existsSync(DJANGO_APP_DIR))
console.log(DJANGO_TEMP_PATH, fs.existsSync(DJANGO_TEMP_PATH))


if (!fs.existsSync(DJANGO_APP_DIR) || !fs.existsSync(DJANGO_TEMP_PATH)) {
  console.error("Django app dir doesn't exists");
  return
}

// html file we are working on
const buildContent = fs.readFileSync(BUILD_PATH, 'utf8');
const $r = cheerio.load(buildContent);

function static(path, html){
  if (lodash.isEmpty(path)) {
    const re = "/static/xboard/react/"
    return html.replace(re, `{% static 'xboard/react/' %}`);
  }
  let src = path.replace('/static/', '');
  return html.replace(path, `{% static '${src}' %}`)
}

// Get css files
const excluded_links = [
  "favicon.ico",
  "manifest.json",
  "fonts.googleapis.com",
  "suit.css",
  "logo192.png",
  "font-awesome.min.css",
];
const css_files = []
$r('link')
  .filter((i, el) => !excluded_links.some(itm => $r(el).attr('href').indexOf(itm) > -1 ))
  .each((idx, el) => {
    let html = static($r(el).attr('href'), $r.html(el));
    css_files.push(html)
  })

// Get js file
const js_files = []
$r('script')
  .each((idx, el) => {
    let html = static($r(el).attr('src'), $r.html(el));
    js_files.push(html)
  })

console.log(css_files);
console.log(js_files);

// Generated HTML blocks
const cssHTML = `{% block extrastyle %}\n{{ block.super }}\n${css_files.join('\n')}\n{% endblock %}\n`;
const appHTML = `{% block content %}\n<div id='root'></div>\n${js_files.join('\n')}\n{% endblock %}\n`;
const HTML = `${cssHTML}\n${appHTML}`


// Export
fs.copyFileSync(DJANGO_TEMP_PATH, DESTFILE);
fs.appendFileSync(DESTFILE, HTML);
