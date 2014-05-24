var upnode = require('upnode');
var db = require('levelup');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');


module.exports = function(dbi, code) {
  if (typeof dbi === 'string') { dbi = db(dbi); }
  var emitter = new EventEmitter();
  var cmds = {
    get: function (key, cb) {
      emitter.emit('log', {action: 'get', key: key});
      dbi.get(key, function (e, o) {
        if (e) {
          emitter.emit('log', {
            action: 'get',
            key: key,
            status: 'error',
            message: e.msg});
          }
          if (cb) cb(e); return; }
        var result = JSON.parse(o);
        if (cb) cb(null, result);
      });
    },
    put: function (key, value, cb) {
      var tx = { date: (new Date()).toString(), action: 'put', key: key, value: value};
      if (_(value).isObject()) value = JSON.stringify(value);
      dbi.put(key, value, function(err, res) {

      });
    },
    del: function (key, cb) {
      emitter.emit('log', { action: 'del', key: key});
      dbi.del(key, cb);
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
