const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
console.log(process.env.DB_USER);
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he6ho.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(port);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error',err);
  const blogCollection = client.db('heroBlog').collection("blogs");
  const adminCollection = client.db('heroBlog').collection("admins");

  //CRUD FUNCTION START HERE
  // -------------- FETCH SERVICE --------------
  app.get('/blogs',(req, res)=>{
    blogCollection.find({})
    .toArray()
    .then(items=>{
      res.send(items)
      console.log(items);
    })
    .catch(err => console.error(`Failed to find documents: ${err}`))
  })

  /// -------------- ADD BLOG --------------
  app.post('/addBlog',(req, res)=>{
    const newBlog=req.body;
    console.log('adding blog:',newBlog);
    blogCollection.insertOne(newBlog)
    .then(result=>{
      console.log('result',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  // -------------- FETCH ALL ORDER --------------
  app.get('/allOrders', (req, res) => {
    orderCollection.find({})
        .toArray((err, documents) => {
            res.status(200).send(documents);
        })
})
  // -------------- ADD ADMIN --------------
  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
// -------------- CHECK ADMIN --------------
app.get('/Admin', (req, res) => {
  adminCollection.find({ email: req.query.email, password: req.query.password })
      .toArray((err, documents) => {
        console.log('admin',err);
          res.status(200).send(documents);
      })
})

  // -------------- DELETE BLOG --------------
  app.delete('/delete/:id',(req, res)=>{
    const id=ObjectId(req.params.id)
    console.log('delete',id);
    blogCollection.findOneAndDelete({_id:id})
    .then(documents=>{
    res.send(!!documents.value)
    console.log("delete",documents)})
  })
  console.log('connected');
  // End
   
});

app.listen(port)

app.get('/', (req, res) => {
    res.send('DataBase connected')
})

