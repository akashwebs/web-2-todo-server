const { MongoClient, ServerApiVersion, ConnectionCheckOutStartedEvent, ObjectId, CURSOR_FLAGS } = require('mongodb');
const express = require('express');
const app=express()
const cors = require('cors');

require('dotenv').config()

app.use(cors())
app.use(express.json())

const port=process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vcbif.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const taskCollection = client.db("todo").collection("tasks");
        const eventCollection = client.db("todo").collection("event");

        app.post('/addTask',async(req,res)=>{
           const task=req.body;
           const result=await taskCollection.insertOne(task);
           res.send(result)
        })
        app.get('/task',async(req,res)=>{
            const result=await taskCollection.find({isCompelete:false}).toArray()
            res.send(result)
        })
        app.get('/compeltetask',async(req,res)=>{
            
            const result=await taskCollection.find({isCompelete:true}).toArray()
            res.send(result)
        })
        app.put('/updateTask/:id',async(req,res)=>{
            const id = req.params.id;
            const task = req.body;
            
            if (!id) { return }
            const filter = { _id:ObjectId(id) }
            
            const updateDoc = {
                $set: task
            };
            const result = await taskCollection.updateOne(filter, updateDoc)
            res.send({ result });
        })

        app.delete('/deleteTask/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await taskCollection.deleteOne(query);
            res.send(result)
        })

    //    for event 
    app.post('/events',async(req,res)=>{
        const events=req.body;
        const result =await eventCollection.insertOne(events);
        res.send(result)
    })
    app.get('/events/:date',async(req,res)=>{
        const query=req.params;
        console.log(query)
        const result=await eventCollection.find(query).toArray()
        res.send(result);
    })

    }finally{

    }
    

}
run().catch(console.dir)




app.get('/',(req,res)=>{
    res.send('todo task is running')
})
app.listen(port,()=>{
    console.log('successfully run doto-task', port)
})