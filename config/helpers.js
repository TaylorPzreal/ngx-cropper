const path = require('path');
const _root = path.resolve(__dirname, '..');

function root(...args) {
  return path.join.apply(path, [_root].concat(args));
}

exports.root = root;
