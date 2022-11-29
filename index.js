const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config()

//midelewere
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5gquyue.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection=client.db('kenakata').collection('products')
        const allCategoriy=client.db('kenakata').collection('categories');
        const bookingsCollection=client.db('kenakata').collection('bookings')
        const usersCollection=client.db('kenakata').collection('users')
        
        app.get('/products',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query)
            const products=await cursor.toArray()
            res.send(products)
        });

        app.get('/products/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const product=await serviceCollection.findOne(query);
            res.send(product)
           
        })

      
        app.get('/category/:id',async(req, res) => {
            const id=req.params.id;
            const query={id:parseInt(id)}
            const cursor=serviceCollection.find(query);
            const category=await cursor.toArray()
            res.send(category)
        })

        app.get('/category', async(req,res)=>{
            const query={}
            const cursor=allCategoriy.find(query)
            const categories=await cursor.toArray()
            res.send(categories)

        })

        app.post('/bookings',async(req,res)=>{
            const booking=req.body
            const result=await bookingsCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/bookings',async(req,res)=>{
            const email=req.query.email;
            const query={email:email};
            const bookings=await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result=await usersCollection.insertOne(user)
            res.send(result)
        })

        

       
      
        
      
    }
    finally{

    }


}
run().catch(error=>console.error(error))





app.get('/',(req,res)=>{
    res.send('your server is runing')
})

app.listen(port,()=>{
    console.log('kenakata server is running')
})