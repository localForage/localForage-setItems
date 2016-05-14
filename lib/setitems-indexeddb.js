import { executeCallback, forEachItem } from './utils';

export function setItemsIndexedDB(items, keyFn, valueFn, callback) {
    var localforageInstance = this;

    var promise = new Promise(function(resolve, reject) {
        localforageInstance.ready().then(function() {
            // Inspired from @lu4 PR mozilla/localForage#318
            var dbInfo = localforageInstance._dbInfo;
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);

            var itemPromises = forEachItem(items, keyFn, valueFn, function(key, value) {
                // The reason we don't _save_ null is because IE 10 does
                // not support saving the `null` type in IndexedDB. How
                // ironic, given the bug below!
                // See: https://github.com/mozilla/localForage/issues/161
                if (value === null) {
                    value = undefined;
                }
                var request = store.put(value, key);

                return new Promise(function(resolve, reject){
                    request.onsuccess = resolve;
                    request.onerror = function() {
                        reject(request.error);
                    };
                });
            });

            Promise.all(itemPromises).then(function(){
                transaction.oncomplete = function() {
                    resolve(items);
                };
            }).catch(reject);

            transaction.onabort = transaction.onerror = function(event) {
                reject(event.target);
            };

        }).catch(reject);
    });
    executeCallback(promise, callback);
    return promise;
}
