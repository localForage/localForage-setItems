localForage-setItems
====================
[![npm](https://img.shields.io/npm/dm/localforage-setitems.svg)](https://www.npmjs.com/package/localforage-setitems)  
Adds setItems method to [localForage](https://github.com/mozilla/localForage).

## Requirements

* [localForage](https://github.com/mozilla/localForage) v1.4.0+
  * for earlier versions of localforage, please use the v1.1.x releases

## Installation
`npm i localforage-setitems`


##jsperf links
* [default driver order (indexedDB prefered)](http://jsperf.com/localforage-setitems)
* [websql (not for firefox)](http://jsperf.com/localforage-setitems-websql)

## API
You can pass an array with the key-value pairs:
```js
var items = [
  { key: 'asdf', value: 'asdf value!' },
  { key: 'asap', value: 'asap value!' },
  { key: 'async', value: 'async value!' }
];
localforage.setItems(items);
```

Or you can pass a object with the keys as properties:
```js
var items = {
  asdf: 'asdf value!',
  asap: 'asap value!',
  async: 'async value!'
};
localforage.setItems(items);
```
