import { createMapperHooksStore } from "@extremelyjs/store/src/index";

interface TestArrType {
    test: string;
    test2: string;
    test3: number;
}

const testArrStore = createMapperHooksStore<TestArrType[]>();

export const useTestArr = testArrStore.useStoreValue;

export const setTestArr = testArrStore.setStoreValue;

export const resetTestArr = testArrStore.reset;