import { createMapperHooksStore } from "@extremelyjs/store/src/index";

const numStore = createMapperHooksStore<number>(0);

export const useNum = numStore.useStoreValue;

export const setNum = numStore.setStoreValue;

export const resetNum = numStore.reset;