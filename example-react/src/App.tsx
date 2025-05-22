import {useCallback, useEffect, useState} from 'react';
import {createMapperHooksStore} from '../../src';
import * as api from '../../src';
import Button from './components/Button';
import {useNum} from './store/num';
import {loadTestAsync, useTestAsync} from './store/testAsync';
import {mockPromiseArray} from './mock/mockPromiseArray';
import {
    loadIndexData,
    useIndexData,
    useIndexDataLoading,
} from './store/indexData';
import {setStr, useStr} from './store/str';
import {setTestArr, useTestArr} from './store/arr';
import {setTestObject, useTestObject} from './store/testObject';

interface IUser {
  age: number;
  name: string;
  address: string;
}

// function App() {
//   const num = useNum();
//   const testAsync = useTestAsync();
//   const indexValue = useIndexData();
//   const indexValueLoading = useIndexDataLoading();
//   const testArr = useTestArr();
//   console.log(testArr);
//   const userInfo = useTestObject<string>((value) => value?.id);
//   console.log("--userInfo--")
//   console.log(userInfo);
//   useEffect(() => {
//     loadTestAsync(mockPromiseArray());
//     loadIndexData("Hello");
//     console.log("--testArr--")
//     setTestObject({
//       id: '1',
//       name: "zhangsan",
//       age: 18,
//       address: "beijing"
//     })
//   }, [])

//   console.log("indexLoading", indexValueLoading)
//   const str = useStr();

//   const handleChange = useCallback(() => {
//     setStr(v => v+"xxx");
//   },[])

//   const handleSetTestArray = useCallback(() => {
//     setTestArr([
//       {
//         test: "123",
//         test2: "123",
//         test3: 123
//       }
//     ]);
//     setTestArr(v => [...v, {
//       test: "123",
//       test2: "123",
//       test3: 123
//     }]);
//   },[])

//   const handleSetUserInfo = useCallback(() => {
//     setTestObject(v => (
//       {
//         ...v,
//         name: "lisi"
//       }
//     ))
//   },[]);

//   const store = createMapperHooksStore<IUser, void>({
//     age: 18,
//     name: 'red',
//     address: 'ccc',
//   });
//   const value = store.useStoreValue((value) => value?.age);
//   useEffect(() => {
//       store.setStoreValue(v => ({...v,age: v?.age + 1}));
//   }, [store]);

//   return (
//     <div>
//       <h1>demo</h1>
//       <button onClick={handleSetTestArray}>
//         setTestArray
//       </button>
//       <button onClick={handleSetUserInfo}>
//         setUserInfo
//       </button>
//       <h2>{num}</h2>
//       <Button></Button>
//       <p>
//         load:
//         {
//           testAsync
//         }
//       </p>
//       <p>
//         request:
//         {
//           indexValueLoading === true ? "loading" : JSON.stringify(indexValue)
//         }
//       </p>
//       {str}
//       <button onClick={handleChange}>+xxx</button>
//       {value}
//     </div>
//   )
// }

// function App() {
//   const userInfo = useTestObject<string>((value) => value?.id);

//   const handleClick = useCallback(() => {
//     setTestObject(v => ({...v, id: v?.id + 1}))
//   }, [])

//   useEffect(() => {
//     setTestObject(v => ({...v, id: v?.id + 1}))
//   }, [])

//   console.log(userInfo);
//   return (
//     <div>
//       <button onClick={handleClick}>点击</button>
//     </div>
//   )
// }

function App() {
    const store = api.createMapperHooksStore<IUser, void>({
        age: 18,
        name: 'red',
        address: 'ccc',
    });
    const value = store.useStoreValue(value => value?.age);
    useEffect(
        () => {
            store.setStoreValue(v => ({...v, age: v.age + 1}));
        },
        [store]
    );
    const handleClick = useCallback(
        () => {
            store.setStoreValue(v => ({...v, age: v.age + 1}));
        },
        [store]
    );
    return (
        <div>
            <div>{value}</div>
            <button onClick={handleClick}>点击</button>
        </div>
    );
}

export default App;
