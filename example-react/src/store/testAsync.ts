import { createStore } from "@extremelyjs/store/src/index";

const testAsyncStore = createStore<string>("",{strategy: "acceptSequenced"});

export const useTestAsync = testAsyncStore.useStoreValue;

export const loadTestAsync = testAsyncStore.load;
