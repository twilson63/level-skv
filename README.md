# level-skv

[![Build Status](https://secure.travis-ci.org/twilson63/level-skv.png)](http://travis-ci.org/twilson63/level-skv)

Simple key-value Datastore Server (skv)

skv exposes the `levelUp` interface via upnode or dnode.

skv is a key-value store that has four commands:

* get
* put
* del
* change
* query

It uses the upnode/dnode protocol as a client.

## server example

``` sh
npm install skv -g
skv 4321 --dbname=foo --secret=bar --debug=true
```

## client example

``` js
require('upnode').connect('skv.example.com', 4321, function (remote) {
  remote.auth('bar', ready);
});

function ready(err, db) {
  db.put('mydoc', {sync: true}, {content: 'hello world'});
  db.get('mydoc', function (err, doc) {
    console.log(doc);
  });
  // emit all kv's
  db.query(function(data) {
    console.log(data);
  }, function() {
    console.log('end');
  });
}

```

## Try the REPL

``` js
cd repl
./skv-client --port=4321 --secret=foo

```


## Status

Still in development mode


## Test

```
npm test
```
