const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt=require('jsonwebtoken')
const { query } = require('express');
require('dotenv').config()

//midelewere
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5gquyue.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req,res,next){
   const authHeader= req.headers.authorization;
   if(!authHeader){
      res.status(401).send({message:'unauthorized access'})
   }
   const token=authHeader.split(' ')[1];
   jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
    if(err){
        res.status(403).send({message:'unauthorized access'})
    }
    req.decoded=decoded;
    next()
   })

}

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

        app.post('/products',async(req,res)=>{
            const product=req.body;
            const result=await serviceCollection.insertOne(product)
            res.send(result)
        })

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
            // const decoded=req.decoded;
            // if(decoded.email !== req.query.email){
            //     res.send(403).send({message:'unauthorized access'})
            // }
            const email=req.query.email;
            const query={email:email};
            const bookings=await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        app.post('/jwt',async(req,res)=>{
          const user=req.body;
          const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
          res.send({token})
        
        })

        app.get('/users',async(req,res)=>{
            const query={};
            const users=await usersCollection.find(query).toArray()
            res.send(users)

        })

        

        app.get('/users/admin/:email',async (req,res)=>{
            const email=req.params.email;
            const query={email}
            const result=await usersCollection.findOne(query)
            // res.send({isAdmin:user?.role==='admin'})
        })

        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result=await usersCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/admin/:id',async (req,res)=>{
            const id =req.params.id;
            const filter={id:ObjectId(id)}
            const options={upsert:true}
            const updateDoc={
                $set:{
                    role:"admin"
                }
            }
            const result=await usersCollection.updateOne(filter,updateDoc,options);
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