export function getSerializerPromise(localForageInstance) {
    if (getSerializerPromise.result) {
        return getSerializerPromise.result;
    }
    if (!localForageInstance || typeof localForageInstance.getSerializer !== 'function') {
        return Promise.reject(new Error(
            'localforage.getSerializer() was not available! ' +
            'localforage v1.4+ is required!'));
    }
    getSerializerPromise.result = localForageInstance.getSerializer();
    return getSerializerPromise.result;
}

export function getDriverPromise(localForageInstance, driverName) {
    getDriverPromise.result = getDriverPromise.result || {};
    if (getDriverPromise.result[driverName]) {
        return getDriverPromise.result[driverName];
    }
    if (!localForageInstance || typeof localForageInstance.getDriver !== 'function') {
        return Promise.reject(new Error(
            'localforage.getDriver() was not available! ' +
            'localforage v1.4+ is required!'));
    }
    getDriverPromise.result[driverName] = localForageInstance.getDriver(driverName);
    return getDriverPromise.result[driverName];
}

export function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function(result) {
            callback(null, result);
        }, function(error) {
            callback(error);
        });
    }
}

export function forEachItem(items, keyFn, valueFn, loopFn) {
    function ensurePropGetterMethod (propFn, defaultPropName) {
        var propName = propFn || defaultPropName;

        if ((!propFn || typeof propFn !== 'function') &&
            typeof propName === 'string') {
            propFn = function(item){ return item[propName]; };
        }
        return propFn;
    }

    var result = [];
    // http://stackoverflow.com/questions/4775722/check-if-object-is-array
    if (Object.prototype.toString.call(items) === '[object Array]') {
        keyFn = ensurePropGetterMethod(keyFn, 'key');
        valueFn = ensurePropGetterMethod(valueFn, 'value');

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            result.push(loopFn(keyFn(item), valueFn(item)));
        }
    } else {
        for (var prop in items) {
            if (items.hasOwnProperty(prop)) {
                result.push(loopFn(prop, items[prop]));
            }
        }
    }
    return result;
}
