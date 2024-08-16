import { useEffect } from "react";
import Button from "./components/Button";
import { useNum } from "./store/num";
import { loadTestAsync, useTestAsync } from "./store/testAsync";
import { mockPromiseArray } from "./mock/mockPromiseArray";

function App() {
  const num = useNum();
  const testAsync = useTestAsync();

  useEffect(() => {
    loadTestAsync(mockPromiseArray());
  },[])

  return (
    <div>
      <h1>demo</h1>
      <h2>{num}</h2>
      <Button></Button>
      {
        testAsync
      }
    </div>
  )
}

export default App;