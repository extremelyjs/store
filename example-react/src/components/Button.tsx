import { useCallback } from "react";
import { resetNum, setNum } from "../store/num";

function Button() {
    const handleAdd = useCallback(() => {
        setNum(num => num + 10);
    }, [])
    const handleSetValue = useCallback(() => {
        setNum(1);
    }, [])
    const handleReset = useCallback(() => {
        resetNum();
    }, [])
    return (
        <>
            <button onClick={handleAdd}>
                按钮(num+10)
            </button>
            <button onClick={handleSetValue}>
                按钮(num = 1)
            </button>
            <button onClick={handleReset}>
                按钮(重置num)
            </button>
        </>
    )
}

export default Button;