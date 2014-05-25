var upnode = require('upnode');
var db = require('levelup');
var EventEmitter = require('events').EventEmitter;

// skv
module.exports = function(dbi, code) {
  //var args = Array.prototype.slice.call(arguments);
  if (typeof dbi === 'string') { dbi = db(dbi, { valueEncoding: 'json' }); }
  var emitter = new EventEmitter();

  var log = function(action) {
    return function (data, cb) {
      var tx = {
        action: action,
        data: data,
        date: (new Date()).toString()
      };
      // notify if change
      if (~['put', 'del'].indexOf(action)) emitter.emit('change', tx);
      emitter.emit('log', tx);
      if (cb) cb(null, value);
    };
  }

  var cmds = {
    get: function () {
      var args = Array.prototype.slice.call(arguments);
      log('get')({ key: args[0]});
      dbi.get.apply(dbi, args);
    },
    put: function () {
      var args = Array.prototype.slice.call(arguments);
      dbi.put.apply(dbi, args);
      log('put')({ key: args[0], value: args[1]});
    },
    del: function () {
      var args = Array.prototype.slice.call(arguments);
      dbi.del.apply(dbi, args);
      log('del')({ key: args[0]});
    },
    change: function (fn) {
      emitter.on('change', fn);
    }
  };
  var auth = {
    auth: function(secret, cb) {
      if (code === secret) {
        cb(null, cmds);
      } else {
        cb({message: 'Authorization Denied!'});
      }
    }
  };
  // if code is set then add auth check
  var s = upnode(code ? auth : cmds);
  s.emitter = emitter;
  return s;
};
