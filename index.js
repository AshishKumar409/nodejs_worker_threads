let express = require("express")
const { exitCode } = require("node:process")
const {Worker} = require("node:worker_threads")

// time curl --get http://localhost:3000/blocking

let app = express()


let PORT = 3000

app.get("/non-blocking",(req,res)=>{
    res.status(200).send("this is non blocking route")
})

app.get("/blocking",async (req,res)=>{

    let worker = new Worker("./worker.js")

    worker.on("online",(anything)=>{
      console.log("worker is online ", anything)
    })

    worker.on("message",(data)=>{
      res.status(200).send(`this result is ${data}`)
    })

    worker.on("error",(error)=>{
      res.status(404).send(`${error}`)
    })

    worker.on("exit",(exitCode)=>{
        console.log("worker is exited ", exitCode)  
    })
    
    
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${3000}`)
})