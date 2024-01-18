/**
 * module-root <https://github.com/jonschlinkert/module-root>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

import path from 'path';
import callsite from 'callsite';
import findup from 'findup-sync';

export default (...args) => {
  const name = args.find(arg => typeof arg === 'string');
  const options = args.find(arg => typeof arg === 'object') || {};
  options.cwd = options.cwd || process.cwd();
  if (name) {
    return findup(path.join('node_modules', ...name.split('/')), { cwd: options.cwd });
  }
  return path.dirname(findup('package.json', { cwd: path.dirname(callsite()[1].getFileName()) }));
};
