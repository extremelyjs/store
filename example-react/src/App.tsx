import { useCallback, useEffect } from "react";
import Button from "./components/Button";
import { useNum } from "./store/num";
import { loadTestAsync, useTestAsync } from "./store/testAsync";
import { mockPromiseArray } from "./mock/mockPromiseArray";
import { loadIndexData, useIndexData, useIndexDataLoading } from "./store/indexData";
import { setStr, useStr } from "./store/str";


function App() {
  const num = useNum();
  const testAsync = useTestAsync();
  const indexValue = useIndexData();
  const indexValueLoading = useIndexDataLoading();

  useEffect(() => {
    loadTestAsync(mockPromiseArray());
    loadIndexData("Hello");
  }, [])

  console.log("indexLoading", indexValueLoading)
  const str = useStr();

  const handleChange = useCallback(() => {
    setStr(v => v+"xxx");
  },[])

  return (
    <div>
      <h1>demo</h1>
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