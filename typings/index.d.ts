/// <reference types="localforage" />

interface KeyValuePair {
    key: string;
    value: any;
}

type LocalForageSetItemsArrayParam = KeyValuePair[];

interface LocalForageSetItemsObjectParam {
    [key: string]: any;
}

interface ILocalForageWithSetItems {
    setItems(param: LocalForageSetItemsArrayParam): Promise<void>;
    setItems(param: LocalForageSetItemsObjectParam): Promise<void>;
}

interface LocalForage extends ILocalForageWithSetItems { }

interface LocalForageWithSetItems extends LocalForage { }

declare module "localforage-setitems" {
    export function extendPrototype(localforage: LocalForage)
        : LocalForageWithSetItems;

    export var extendPrototypeResult: boolean;
}
