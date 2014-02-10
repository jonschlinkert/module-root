/**
 * module-root <https://github.com/jonschlinkert/module-root>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var path = require('path');
var findup = require('findup-sync');


module.exports = function(name) {
  var fullpath = path.dirname(require.resolve(name));
  var dir = findup('package.json', {cwd: fullpath})
  return path.resolve(path.dirname(dir));
};