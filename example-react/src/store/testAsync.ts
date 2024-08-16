import { createMapperHooksStore } from "@extremelyjs/store/src/index";

const testAsyncStore = createMapperHooksStore<string>("",{strategy: "acceptLatest"});

export const useTestAsync = testAsyncStore.useStoreValue;

export const loadTestAsync = testAsyncStore.load;