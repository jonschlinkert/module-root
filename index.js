/**
 * module-root <https://github.com/jonschlinkert/module-root>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var path = require('path');
var callsite = require('callsite');
var findup = require('findup-sync');

module.exports = function(name) {
  var fullpath;
  if (name) {
    fullpath = require.resolve(name);
  } else {
    fullpath = callsite()[1].getFileName();
  }
  var cwd = path.dirname(fullpath);
  var pkg = findup('package.json', { cwd: cwd });
  return path.resolve(path.dirname(pkg));
};
