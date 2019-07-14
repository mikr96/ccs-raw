(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function getNumberParts(x) {
  var float = new Float64Array(1),
    bytes = new Uint8Array(float.buffer);

  float[0] = x;

  var sign = bytes[7] >> 7,
    exponent = ((bytes[7] & 0x7f) << 4 | bytes[6] >> 4) - 0x3ff;

  bytes[7] = 0x3f;
  bytes[6] |= 0xf0;

  return {
    sign: sign,
    exponent: exponent,
    mantissa: float[0],

  }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1VzZXIvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvdXRpbHMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROdW1iZXJQYXJ0cyh4KSB7XHJcbiAgdmFyIGZsb2F0ID0gbmV3IEZsb2F0NjRBcnJheSgxKSxcclxuICAgIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoZmxvYXQuYnVmZmVyKTtcclxuXHJcbiAgZmxvYXRbMF0gPSB4O1xyXG5cclxuICB2YXIgc2lnbiA9IGJ5dGVzWzddID4+IDcsXHJcbiAgICBleHBvbmVudCA9ICgoYnl0ZXNbN10gJiAweDdmKSA8PCA0IHwgYnl0ZXNbNl0gPj4gNCkgLSAweDNmZjtcclxuXHJcbiAgYnl0ZXNbN10gPSAweDNmO1xyXG4gIGJ5dGVzWzZdIHw9IDB4ZjA7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzaWduOiBzaWduLFxyXG4gICAgZXhwb25lbnQ6IGV4cG9uZW50LFxyXG4gICAgbWFudGlzc2E6IGZsb2F0WzBdLFxyXG5cclxuICB9XHJcbn1cclxuIl19
