import { useCallback, useEffect } from "react";
import Button from "./components/Button";
import { useNum } from "./store/num";
import { loadTestAsync, useTestAsync } from "./store/testAsync";
import { mockPromiseArray } from "./mock/mockPromiseArray";
import { loadIndexData, useIndexData, useIndexDataLoading } from "./store/indexData";
import { setStr, useStr } from "./store/str";
import { setTestArr, useTestArr } from "./store/arr";


function App() {
  const num = useNum();
  const testAsync = useTestAsync();
  const indexValue = useIndexData();
  const indexValueLoading = useIndexDataLoading();
  const testArr = useTestArr();
  console.log(testArr);

  useEffect(() => {
    loadTestAsync(mockPromiseArray());
    loadIndexData("Hello");
  }, [])

  console.log("indexLoading", indexValueLoading)
  const str = useStr();

  const handleChange = useCallback(() => {
    setStr(v => v+"xxx");
  },[])

  const handleSetTestArray = useCallback(() => {
    setTestArr([
      {
        test: "123",
        test2: "123",
        test3: 123
      }
    ]);
    setTestArr(v => [...v, {
      test: "123",
      test2: "123",
      test3: 123
    }]);
  },[])

  // console.log(testArr[0].test)

  return (
    <div>
      <h1>demo</h1>
      <button onClick={handleSetTestArray}>
        setTestArray
      </button>
      <h2>{num}</h2>
      <Button></Button>
      <p>
        load:
        {
          testAsync
        }
      </p>
      <p>
        request:
        {
          indexValueLoading === true ? "loading" : JSON.stringify(indexValue)
        }
      </p>
      {str}
      <button onClick={handleChange}>+xxx</button>
    </div>
  )
}

export default App;