/**
 * module-root <https://github.com/jonschlinkert/module-root>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

import path from 'path';
import callsite from 'callsite';
import findup from 'findup-sync';
import resolveFrom from 'resolve-from';

export default (...args) => {
  let pkg;
  try {
    const fullpath = args.length > 0 ? resolveFrom(process.cwd(), args[0]) : callsite()[1].getFileName();
    const cwd = path.dirname(fullpath);
    pkg = findup('package.json', { cwd });
  } catch {
    pkg = resolveFrom(process.cwd(), `${args[0]}/package.json`);
  }
  return path.resolve(path.dirname(pkg));
};
