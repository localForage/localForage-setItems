import { extendPrototype } from 'localforage-setitems';

declare let localforage: LocalForage;

namespace LocalForageSetItemsTest {

    {
        let localforage2: LocalForageWithSetItems = extendPrototype(localforage);
    }

    {
        let itemsPromise: Promise<void> = localforage.setItems({
          key1: '1',
          key2: 2,
          key3: { test: 'object' },
        });

        itemsPromise.then(() => {
          console.log('Done!')
        });
    }

    {
        let itemsPromise: Promise<void> = localforage.setItems([
          { key: 'key1', value : '1' },
          { key: 'key2', value : 2 },
          { key: 'key3', value : { test: 'object' } },
        ]);

        itemsPromise.then(() => {
          console.log('Done!')
        });
    }
}
