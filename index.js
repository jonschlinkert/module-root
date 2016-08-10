/**
 * module-root <https://github.com/jonschlinkert/module-root>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var path = require('path');
var callsite = require('callsite');
var findup = require('findup-sync');

module.exports = function(name) {
  if (!name) {
    name = callsite()[1].getFileName();
  }
  var fullpath = path.dirname(require.resolve(name));
  var dir = findup('package.json', {cwd: fullpath})
  return path.resolve(path.dirname(dir));
};
