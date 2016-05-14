import localforage from 'localforage';
import { executeCallback, forEachItem } from './utils';
import { setItemsIndexedDB } from './setitems-indexeddb';
import { setItemsWebsql } from './setitems-websql';

export function setItemsGeneric(items, keyFn, valueFn, callback) {
    var localforageInstance = this;

    var itemPromises = forEachItem(items, keyFn, valueFn, function(key, value) {
        return localforageInstance.setItem(key, value);
    });
    var promise = Promise.all(itemPromises);

    executeCallback(promise, callback);
    return promise;
}

export function localforageSetItems(items, keyFn, valueFn, callback) {
    var localforageInstance = this;
    var currentDriver = localforageInstance.driver();

    if (currentDriver === localforageInstance.INDEXEDDB) {
        return setItemsIndexedDB.call(localforageInstance, items, keyFn, valueFn, callback);
    } else if (currentDriver === localforageInstance.WEBSQL) {
        return setItemsWebsql.call(localforageInstance, items, keyFn, valueFn, callback);
    } else {
        return setItemsGeneric.call(localforageInstance, items, keyFn, valueFn, callback);
    }
}

export function extendPrototype(localforage) {
    var localforagePrototype = Object.getPrototypeOf(localforage);
    if (localforagePrototype) {
        localforagePrototype.setItems = localforageSetItems;
        localforagePrototype.setItems.indexedDB = function(){
            return setItemsIndexedDB.apply(this, arguments);
        };
        localforagePrototype.setItems.websql = function(){
            return setItemsWebsql.apply(this, arguments);
        };
        localforagePrototype.setItems.generic = function(){
            return setItemsGeneric.apply(this, arguments);
        };
    }
}

export var extendPrototypeResult = extendPrototype(localforage);
