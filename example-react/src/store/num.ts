import { createStore } from "@extremelyjs/store/src/index";

const numStore = createStore<number>(0,{withLocalStorage: "num"});

export const useNum = numStore.useStoreValue;

export const setNum = numStore.setStoreValue;

export const resetNum = numStore.reset;