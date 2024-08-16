function mockPromiseArray() {
    // 模拟十个异步任务，返回数字
    const arr = []
    for (let i = 0; i < 10; i++) {
        arr.push(new Promise((resolve) => {
            setTimeout(() => resolve(i), 1000 * i);
        }))
    }
    return arr;
}

export {
    mockPromiseArray
}