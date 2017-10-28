localForage-setItems
====================
[![npm](https://img.shields.io/npm/dm/localforage-setitems.svg)](https://www.npmjs.com/package/localforage-setitems)  
Adds setItems method to [localForage](https://github.com/mozilla/localForage).

## Requirements

* [localForage](https://github.com/mozilla/localForage) v1.4.0+
  * for earlier versions of localforage, please use the v1.1.x releases

## Installation
`npm i localforage-setitems`

## Importing

### TypeScript

[Include `localforage` with an import statement appropriate for your configuration](https://github.com/localForage/localForage/blob/master/README.md#typescript) and import `localforage-setitems` right after it.

Normally, `localforage-setitems` will extend the prototype of `locaforage` to include the `setItems()` method, but unfortunately the typings can't be updated.
As a result you should use the exported `extendPrototype()` method, which returns the provided localforage instance but with inherited typings that also include the `setItems()` method.

```javascript
import localForage from 'localforage';
// OR based on your configuration:
// import * as localForage from 'localforage';

import { extendPrototype } from 'localforage-setitems';

extendPrototype(localforage);

// Keep using localForage as usual.
```

### Known issues with module bundlers

In some ES6 module bundlers `.setItems()` might not automatically be made available to the `localforage` object on import.
In this case, import the provided `extendPrototype()` method and extend `localforage` manually, as shown in the Typescript section.

## jsperf links
* [default driver order (indexedDB prefered)](https://jsperf.com/localforage-setitems-2017/1)
* [websql (not for firefox)](https://jsperf.com/localforage-setitems-websql-2017b/1)

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

