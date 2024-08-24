import { createMapperHooksStore } from "@extremelyjs/store/src/index";

const strStore = createMapperHooksStore<string>('',{withLocalStorage: 'str-test'});

export const useStr = strStore.useStoreValue;

export const setStr = strStore.setStoreValue;