var test = require('tap').test;
var kv = require('../');
var client = require('upnode');

test('basic server functions', function(t) {
  kv('default').listen(8000);
  client.connect(8000, function(db) {
    db.change(function(data) {
      t.ok(data.action, 'change should return action');
    });
    db.put('hello1', {foo: 'bar'});
    db.get('hello1', function(e, value) {
      t.equals(value.foo, 'bar');
    });
    db.del('hello1', function(e, key) {
      t.end();
      process.nextTick(function() { process.exit(0); });
    });
  });
});
