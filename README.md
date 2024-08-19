# 一种全新的store库

**之前叫@apiknight/store，现已更名**

采用了发布订阅的设计模式，同时提供了大量React hooks，以一种新思路来管理状态，不再需要维护type和reducer，可以实现类似useState,setState式的使用方式。

同时具备了异步更新能力和持久化存储能力，同时采用ts开发，具备了完善的类型提示。

## 优势

- 相比其他状态管理库，采用了类useState,setState的思想。同时天然支持了良好的异步更新，持久化存储等能力。

- 写法上更加自由，心智负担更小，同时可以结合异步请求，异步事件，loading订阅和值订阅。来进一步优化代码结构，建立起统一的代码规范。

## 文档

下面是React Hooks的使用文档。class组件的使用暂没有良好的支持。

### 安装

```bash

npm install @extremelyjs/store --save

```

### 使用方式
要求:
- React Hooks版本
- 如果需要本地持久化存储，需要在有localStorage的环境下使用（例如React native可以使用这个库，但是无法使用本地持久化能力）

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

对于支持localStorage的环境，可以使用持久化能力。

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

对于异步请求更新，可以使用loading订阅。

我们可以写一个纯粹的请求函数，然后使用loadStoreValue来自动更新状态，后续的更新会在内部完成。

同时我们也可以订阅他的loading态，无需额外的代码。

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

#### 异步任务订阅

我们还提供了`load`的api来订阅异步任务。

```tsx
function mockPromiseArray() {
    // 模拟十个异步任务，返回数字
    const arr: Promise<string>[] = []
    for (let i = 0; i < 10; i++) {
        arr.push(new Promise((resolve) => {
            setTimeout(() => resolve(String(i)), 1000 * i);
        }))
    }
    return arr;
}
// store文件
import { createMapperHooksStore } from "@extremelyjs/store/src/index";

const testAsyncStore = createMapperHooksStore<string>("",{strategy: "acceptSequenced"});

export const useTestAsync = testAsyncStore.useStoreValue;

export const loadTestAsync = testAsyncStore.load;

// react组件
const testAsync = useTestAsync();

```

同时我们还支持四种异步更新策略

你可以使用 `strategy` 配置异步策略，目前提供了四种异步策略：

| 策略              | 描述 |
| --- | --- |
| `acceptFirst`     | 在多个异步任务同时发出的情况下，只接受第一个成功的结果。如果已经有成功的返回，则后续请求不再发出。 |
| `acceptLatest`    | 在多个异步任务同时发出的情况下，只接受最后一个发出的任务的结果，成功或失败。 |
| `acceptEvery`     | 在多个异步任务同时发出的情况下，接受所有的返回，按照到达的顺序处理。由于到达的顺序可能是乱序，你需要处理乱序导致的问题。 |
| `acceptSequenced` | 在多个异步任务同时发出的情况下，按照任务发出的顺序，接受结果，当中间的任务到达时，则不再接受此任务之前发起的任务的结果，但依旧等待后续发出的结果。 |

默认使用 `acceptSequenced` 的策略，这个策略满足绝大多数情况，在你需要特别的优化的时候，你可以选择其他的策略。

#### 直接取值

我们还提供了`getStoreValue`和`getStoreLoading`来直接取值。

### Todo

- 完善文档

- 对于ReactNaitve，小程序的本地持久化支持

- 更好的错误提示

- 测试用例的完善

