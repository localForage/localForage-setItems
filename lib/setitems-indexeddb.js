import { executeCallback, forEachItem } from './utils';

// Safari could garbage collect transaction before oncomplete/onerror/onabord being dispatched
// reference transaction to stop it being garbage collected and remove the reference when it finish
var _refTransaction = {};
var _refTransactionId = 0;

function refTransaction(tx) {
    var id = _refTransactionId++;
    _refTransaction[id] = tx;
    return function() {
        delete _refTransaction[id];
    };
}

export function setItemsIndexedDB(items, keyFn, valueFn, callback) {
    var localforageInstance = this;

    var unref = undefined;
    var promise = localforageInstance.ready().then(function () {
        return new Promise(function (resolve, reject) {
            // Inspired from @lu4 PR mozilla/localForage#318
            var dbInfo = localforageInstance._dbInfo;
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);
            var lastError;

            unref = refTransaction(transaction);

            transaction.oncomplete = function() {
                resolve(items);
            };
            transaction.onabort = transaction.onerror = function(event) {
                reject(lastError || event.target);
            };

            function requestOnError(evt) {
                var request = evt.target || this;
                lastError = request.error || request.transaction.error;
                reject(lastError);
            }

            forEachItem(items, keyFn, valueFn, function(key, value) {
                // The reason we don't _save_ null is because IE 10 does
                // not support saving the `null` type in IndexedDB. How
                // ironic, given the bug below!
                // See: https://github.com/mozilla/localForage/issues/161
                if (value === null) {
                    value = undefined;
                }
                var request = store.put(value, key);
                request.onerror = requestOnError;
            });
        });
    });
    promise.then(unref, unref);
    executeCallback(promise, callback);
    return promise;
}
