let express = require("express")
const { exitCode } = require("node:process")
const {Worker} = require("node:worker_threads")

const THREAD_COUNT = 2

let app = express()


let PORT = 3000

app.get("/non-blocking",(req,res)=>{
    res.status(200).send("this is non blocking route")
})

function createWorker(){
    return new Promise((resolve,reject)=>{
        const worker = new Worker("./two-workers.js",{
            workerData:{thread_count:THREAD_COUNT}
        })

        worker.on("online",(anything)=>{
            console.log("worker is online ", anything)
          })
      
          worker.on("message",(data)=>{
         console.log("done with the data",data)
           resolve(data)
          })
      
          worker.on("error",(error)=>{
            reject(`${error}`)
          })
      
          worker.on("exit",(exitCode)=>{
              console.log("worker is exited ", exitCode)  
          })
    })
}

app.get("/blocking",async (req,res)=>{

    let workerPromises = []

    for(let i=0;i<THREAD_COUNT;i++){
        workerPromises.push(createWorker())
    }

    const thread_result = await Promise.all(workerPromises)

    console.log(thread_result)

    const total = thread_result[0]+thread_result[1]

    res.status(200).send(`the result is ${total}`)
    
    
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${3000}`)
})