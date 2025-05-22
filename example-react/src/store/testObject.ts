import {createMapperHooksStore} from '@extremelyjs/store/src/index';

interface MyInfo {
    id: string;
    name: string;
    age: number;
    address: string;
}

const testObjectStore = createMapperHooksStore<MyInfo>({
    id: '1',
    name: 'zhangsan',
    age: 18,
    address: 'beijing',
});

export const useTestObject = testObjectStore.useStoreValue;
export const setTestObject = testObjectStore.setStoreValue;
