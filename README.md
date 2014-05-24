# level-skv

Simple Key Value DataStore Server

This is a wrapper around levelup using upnode as the server interface.  upnode is a lightweight rpc protocol that has the ability to queue up requests if either side is down for a period of time, then sends the requests with the other end comes back up.  

## server example

``` sh
npm install skv -g
skv 4321 --dbname=foo --secret=bar --debug=true
```

## client example

``` js
var client = require('upnode');
client.connect(4321, function (remote) {
  remote.auth('foo', function (db) {
    db.put('hello', {foo: 'bar'});
    db.get('hello', function(err, doc) {
      console.log(doc);
    });
    db.del('hello');
  });
});
```

## Try the REPL

``` js
cd repl
./skv-client --port=48937 --secret=foo

```


## Status

Still in development mode


## Test

```
npm test
```
