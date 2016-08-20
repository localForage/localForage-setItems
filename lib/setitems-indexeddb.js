import { executeCallback, forEachItem } from './utils';

export function setItemsIndexedDB(items, keyFn, valueFn, callback) {
    var localforageInstance = this;

    var promise = new Promise(function(resolve, reject) {
        localforageInstance.ready().then(function() {
            // Inspired from @lu4 PR mozilla/localForage#318
            var dbInfo = localforageInstance._dbInfo;
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);
            var lastError;

            transaction.oncomplete = function() {
                resolve(items);
            };
            transaction.onabort = transaction.onerror = function(event) {
                reject(lastError || event.target);
            };

            forEachItem(items, keyFn, valueFn, function(key, value) {
                // The reason we don't _save_ null is because IE 10 does
                // not support saving the `null` type in IndexedDB. How
                // ironic, given the bug below!
                // See: https://github.com/mozilla/localForage/issues/161
                if (value === null) {
                    value = undefined;
                }
                var request = store.put(value, key);
                request.onerror = function() {
                    lastError = request.error || request.transaction.error;
                    reject(lastError);
                };
            });

        }).catch(reject);
    });
    executeCallback(promise, callback);
    return promise;
}
