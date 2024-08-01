# 一种全新的store库

重新了Redux核心，同时提供了大量React hooks，以一种新思路来管理状态，不再需要维护type和reducer，可以实现类似useState,setState式的使用方式。
同时具备了异步更新能力和持久化存储能力，同时采用ts开发，具备了完善的类型提示。

## 文档

下面是React Hooks的使用文档，vue，原生等使用文档暂未更新

### 安装

```bash

npm install @extremelyjs/store --save
·
```

### 使用方式
要求:
- React Hooks版本
- 如果需要本地持久化存储，需要在有loaclStorage的环境下使用（例如React native可以使用这个库，但是无法使用本地持久化能力）

#### 入门

使用上类似React Hooks中的useState。可以使用use订阅信息,使用set修改信息。其中,set可以传递数值或者回调

```tsx
// 创建num.ts这个store
import { createMapperHooksStore } from '@extremelyjs/store'

const numStore = createMapperHooksStore<number>(0)

export const useNum = numStore.useStoreValue // 监听state变化

export const setNum = numStore.setStoreValue // 修改state，支持value或者callback

export const resetNum = numStore.reset // 重置state

```

使用这个store

```tsx
  function App() {
    const num = useNum(); //订阅num状态
    const handleClick = useCallback(() => {
      setNum(value => value + 1);
    },[])
    const handleChangeValue = useCallback(
      () => {
        setNum(10);
      },[]
    )
    return (
      <div>
        {num}
        <button onClick={
          handleClick
        }>
          +
        </button>
        <button onClick={handleChangeValue}>
          change num 10
        </button>
      </div>
    )
  }

```

#### 持久化

对于支持loaclStorage的环境，可以使用持久化能力。

```tsx
  const num = createMapperHooksStore<number>(0, {withLocalStorage: 'keyName'}) // keyName为自定义id
```

#### 异步更新能力

对于异步更新，可以使用异步更新能力。
```tsx
  import { createMapperHooksStore } from "@extremelyjs/store";
  import fetchCurrentPageContent from "../api/fetchCurrentPageContent";
  import { PageDataParams } from "../type/params";

  const pageDataStore = createMapperHooksStore<string,PageDataParams>('', { withLocalStorage: 'page-data-new' });

  export const usePageData = pageDataStore.useStoreValue; // 订阅state变化

  export const usePageDataLoading = pageDataStore.useStoreLoading; // 订阅Loding状态

  // 异步更新，支持传入参数
  export const loadPageData = pageDataStore.loadStoreValue(
      params => params,
      fetchCurrentPageContent
  );

```

#### loading订阅

对于异步更新，可以使用loading订阅。

```tsx

import { createMapperHooksStore } from "@extremelyjs/store";
import fetchCurrentPageContent from "../api/fetchCurrentPageContent";
import { PageDataParams } from "../type/params";

export interface PageData {
    id: number;
    title: string;
    content: string;
}


const pageDataStore = createMapperHooksStore<string,PageDataParams>('', { withLocalStorage: 'page-data-new' });

export const usePageData = pageDataStore.useStoreValue;
// 订阅Loding状态
export const usePageDataLoading = pageDataStore.useStoreLoading;

export const loadPageData = pageDataStore.loadStoreValue(
    params => params,
    fetchCurrentPageContent
);

// 使用
const loading = usePageDataLoading();

```

### Todo

- 完善文档

- 对于ReactNaitve，小程序的本地持久化支持

- 更好的错误提示

- 测试用例的完善

