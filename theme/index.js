const path = require('path');
const fs = require('fs');
const assets = require('serve-static');
const mustache = require('mustache');
const govukRoot = path.dirname(require.resolve('govuk_template_mustache/package.json'));
const govukTemplate = require.resolve('govuk_template_mustache');

const govukAssets = path.resolve(govukRoot, './assets');

const theme = [
  assets(govukAssets),
  assets(path.resolve(__dirname, './assets'))
];

theme.render = content => {

  return new Promise((resolve, reject) => {
    fs.readFile(govukTemplate, (err, html) => {
      return err ? reject(err) : resolve(html.toString());
    });
  })
  .then(html => {
    return mustache.render(html, {
      assetPath: '/',
      content
    })
  });

};

module.exports = theme;
