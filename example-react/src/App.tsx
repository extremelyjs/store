import Button from "./components/Button";
import { useNum } from "./store/num";

function App() {
  const num = useNum();
  return (
    <div>
      <h1>demo</h1>
      <h2>{num}</h2>
      <Button></Button>
    </div>
  )
}

export default App;