import { createMapperHooksStore } from "@extremelyjs/store/src/index";

const testAsyncStore = createMapperHooksStore<string>("",{strategy: "acceptSequenced"});

export const useTestAsync = testAsyncStore.useStoreValue;

export const loadTestAsync = testAsyncStore.load;

export const loadByTestAsync = testAsyncStore.loadStoreValue(
    params => params,
    fetch
);
