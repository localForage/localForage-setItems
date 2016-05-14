import { getSerializerPromise, executeCallback, forEachItem } from './utils';

export function setItemsWebsql(items, keyFn, valueFn, callback) {
    var localforageInstance = this;
    var promise = new Promise(function(resolve, reject) {
        localforageInstance.ready().then(function() {
            return getSerializerPromise(localforageInstance);
        }).then(function(serializer) {
            // Inspired from @lu4 PR mozilla/localForage#318
            var dbInfo = localforageInstance._dbInfo;
            dbInfo.db.transaction(function(t) {

                var query = 'INSERT OR REPLACE INTO ' +
                     dbInfo.storeName +
                     ' (key, value) VALUES (?, ?)';

                var itemPromises = forEachItem(items, keyFn, valueFn, function(key, value) {
                    return new Promise(function(resolve, reject){
                        serializer.serialize(value, function(value, error) {
                            if (error) {
                                reject(error);
                            } else {
                                t.executeSql(query,[key, value], function() {
                                    resolve();
                                }, function(t, error) {
                                    reject(error);
                                });
                            }
                        });
                    });
                });

                Promise.all(itemPromises).then(function(){
                    resolve(items);
                }, reject);
            }, function(sqlError) {
                reject(sqlError);
            }/*, function() {
                if (resolving) {
                    resolve(items);
                }
            }*/);
        }).catch(reject);
    });
    executeCallback(promise, callback);
    return promise;
}
