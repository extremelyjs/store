import { IndexDataType } from "../types/indexData";

const baseUrl = "http://localhost:3000";

async function getIndex(params: string): Promise<IndexDataType> {
    const res = await fetch(baseUrl + "?params=" + params);
    return res.json();
}


export {
    getIndex,
}