var test = require('tap').test;
var kv = require('../');
var client = require('upnode');

test('setup server with secret', function(t) {
  kv('default', 'foo').listen(8000);
  client.connect(8000, function(remote) {
    remote.auth('foo', function(err, db) {
      db.put('hello', {foo: 'bar'});
      db.get('hello', function(e, result) {
        t.equals(result.foo, 'bar');
        t.end();
        process.nextTick(function() { process.exit(0); });
      })
    });
  });
});
