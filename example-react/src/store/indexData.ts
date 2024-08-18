import { createMapperHooksStore } from "@extremelyjs/store/src/index";
import { getIndex } from "../api";

const indexDataStore = createMapperHooksStore<Record<string,string>,string>(
    {value: ""},
    {withLocalStorage: "index"}
);

export const useIndexData = indexDataStore.useStoreValue;

export const loadIndexData = indexDataStore.loadStoreValue(
    params => params,
    getIndex
);

export const useIndexDataLoading = indexDataStore.useStoreLoading;