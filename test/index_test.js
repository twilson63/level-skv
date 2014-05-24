var test = require('tap').test;
var kv = require('../');
var client = require('upnode');

test('basic server functions', function(t) {
  kv('default').listen(8000);
  client.connect(8000, function(db) {
    db.put('hello1', {foo: 'bar'});
    db.get('hello1', function(e, result) {
      t.equals(result.foo, 'bar');
      t.end();
      process.nextTick(function() { process.exit(0); });
    });

  });
});
