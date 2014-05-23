var dnode = require('dnode');
var db = require('levelup');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var code;

module.exports = {
  server: function(dbi, secret) {
    if (typeof dbi === 'string') {
      dbi = db(dbi);
    }
    if (secret) {
      code = secret;
    }
    var emitter = new EventEmitter();
    var s = dnode({
      get: function (key, cb) {
        emitter.emit('log', {action: 'get', key: key});
        dbi.get(key, function (e, o) {
          if (e) { console.log(e); return cb(e); }
          cb(null, JSON.parse(o));
        });
      },
      put: function (key, value, cb) {
        if (code && code !== secret) {
          emitter.emit('log', {action: 'put',
          message: 'Authorization Required!'});
          return cb({message: 'Authorization Required!'});
        }
        if (_.isFunction(secret)) { cb = secret; }
        emitter.emit('log', { action: 'put', key: key});
        if (_(value).isObject()) value = JSON.stringify(value);
        dbi.put(key, value, cb);
      }
    });
    s.emitter = emitter;
    //s.on('connect', // handle secret here... //)
    return s;
  },
  client: function(hostPort, cb) {
    dnode.connect(hostPort, cb);
  }
};
