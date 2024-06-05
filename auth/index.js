const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes, sign } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var url = process.env.MONGO_URL;

app.post('/signup', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { email, password } = req.body;
    var newUser = { id: id, email: email, password: password };

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');
        var search = { email: email };

        dbo.collection('auth').find(search).toArray((err, res) => {
            if (err) throw err;
            if (res.length == 0) {
                dbo.collection("auth").insertOne(newUser, (err, res) => {
                    if (err) throw err;
                    console.log('User added to database');
                })
            }
            db.close();
        });
    });

    await axios.post(process.env.EVENT_BUS_URL || 'http://localhost:4009/events', {
        type: 'UserCreated',
        data: {
            id, email
        }
    });

    res.status(201).send('User signed up');
    
})

app.post('/login', (req, response) => {
    const { email, password } = req.body;

    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('auth').find({ email: email }).toArray((err, res) => {
            if (err) throw err;
            
            if (res.length == 0) {
                response.status(401).send({});
            } 

            if (email == res[0].email && password == res[0].password) {
                response.status(200).send(res[0].id)
            } else {
                response.status(401).send({})
            }
        })
    })
})

app.post('/events', (req, res) => {
  console.log('Received event:', req.body.type);

  res.send({});
})

app.listen(process.env.PORT || 4000, () => {
    console.log('Authentication Server listening at port 4000...', process.env.PORT || 4000);
})
