const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.prsyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try{
        await client.connect();
        //console.log('connected');
        const database = client.db('travelco');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users');


           
        //Get API
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get API for users
        app.get('/users', async(req, res) =>{
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        //Get single service

        app.get('/services/:id', async(req,res)=>{
            const id =req.params.id;
            const query ={_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })
        //POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
           console.log('hit the post', service)
            const result = await servicesCollection.insertOne(service);
            //console.log(result);
            res.json(result)
        }) 

        //POST API for users
        app.post('/users', async(req, res) =>{
            const user = req.body;
           console.log('hit the post', user)
            const result = await usersCollection.insertOne(user);
            //console.log(result);
            res.json(result)
        })



        //Delete API
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

//Delete API for users
app.delete('/users/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.json(result);
})



   }
   finally{
       //await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running travel server')
})

app.listen(port, () =>{
    console.log('Running travel server on port', port);
})