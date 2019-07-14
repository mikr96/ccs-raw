function extractIC(x) {
  var data = String(x).split(/[eE]/);
  if (data.length == 1) return data[0];

  var z = '', sign = x < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + '0.';
    while (mag++) z += '0';
    return z + str.replace(/^\-/, '');
  }
  mag -= str.length;
  while (mag--) z += '0';
  return str + z;
}

module.exports = {
  extractIC
}