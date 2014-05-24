var upnode = require('upnode');
var db = require('levelup');
var EventEmitter = require('events').EventEmitter;

module.exports = function(dbi, code) {
  if (typeof dbi === 'string') { dbi = db(dbi, { valueEncoding: 'json' }); }
  var emitter = new EventEmitter();

  var log = function(action) {
    return function (data, cb) {
      emitter.emit('log', {
        action: action,
        data: data,
        date: (new Date()).toString()
      });
      if (cb) cb(null, value);
    };
  }

  var cmds = {
    get: function (key, cb) {
      dbi.get(key, function(err, value) {
        if (err) { if (cb) cb(err); return; }
        log('get')({key: key, value: value});
        if (cb) cb(null, value);
      })
    },
    put: function (key, value, cb) {
      dbi.put(key, value, function(err) {
        var tx = {key: key, value: value};
        if (err) { if (cb) cb(err); return; }
        log('put')(tx);
        tx.action = 'put';
        emitter.emit('change', tx);
        if (cb) cb(null, tx);
      });
    },
    del: function (key, cb) {
      dbi.del(key, function (err) {
        var tx = { key: key };
        if (err) { if (cb) cb(err); return; }
        log('del')(tx);
        tx.action = 'del';
        emitter.emit('change', tx);
        if (cb) cb(null, key);
      });
    },
    change: function (fn) {
      emitter.on('change', fn);
    }
  };
  var auth = {
    auth: function(secret, cb) {
      process.nextTick(function(err) {
        if (code === secret) {
          cb(null, cmds);
        } else {
          cb({message: 'Authorization Denied!'});
        }
      });
    }
  };
  // if code is set then add auth check
  var s = upnode(code ? auth : cmds);
  s.emitter = emitter;
  return s;
};
