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
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection=client.db('kenakata').collection('products')
        
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