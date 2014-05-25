require('upnode').connect(8000, function (remote) {
  remote.auth('foo', ready);
});

function ready(err, db) {
  db.change(console.log);
}
