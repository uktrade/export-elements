var path = require('path');


var overrides = {
  'node_modules/govuk_frontend_toolkit/stylesheets/colours': 'overrides/govuk_frontend_toolkit/_colours.scss',
  'node_modules/govuk_frontend_toolkit/stylesheets/colours/organisation': 'overrides/govuk_frontend_toolkit/colours/_organisation.scss',
  'node_modules/govuk_frontend_toolkit/stylesheets/colours/palette': 'overrides/govuk_frontend_toolkit/colours/_palette.scss',
}


module.exports = function (url, prev, done) {    
  // url = the string representing the file to be imported
  // prev = the path of the file requesting the import
  var relativePath = path.join(path.dirname(prev), url);
  if (overrides[relativePath]) {
    console.log('using', overrides[relativePath])
  }
  return { file: overrides[relativePath] || url };
};
