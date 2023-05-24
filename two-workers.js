const {parentPort,workerData} = require("node:worker_threads")

console.log({"workerData.thread_count":workerData.thread_count})

let count = 0
for(let i=0;i<20_000_000_000/workerData.thread_count;i++){
    count++
}

parentPort.postMessage(count)