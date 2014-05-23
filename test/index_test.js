var dnodeServer = require('../').server;
var dnodeClient = require('../').client;

var server = dnodeServer('foo');
server.listen(8080);

var client, remote;


dnodeClient(8080, function (r, c) {
  remote = r;
  client = c;

  remote.put('foo', { "key": "value"}, function (err) {
    remote.get('foo', function (e,v) {
      console.log(v);
    });
  });
});
