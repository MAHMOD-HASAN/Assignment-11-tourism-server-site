const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
      require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfgcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('TourismSite');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');



        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log(service);
            const setService = await serviceCollection.insertOne(service);
            res.json(setService);
        })

        app.get('/service', async (req, res) => {
            const getService = serviceCollection.find({});
            const services = await getService.toArray();
            res.send(services);
        })
         
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const restService = await serviceCollection.deleteOne(query);
            res.json(restService);
        })



        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const setBooking = bookingCollection.insertOne(booking);
            res.json(setBooking);
        })

        app.get('/booking', async (req, res) => {
            const getBooking = bookingCollection.find({});
            const allBooking = await getBooking.toArray();
            res.send(allBooking);
        })

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const restBooking = await bookingCollection.deleteOne(query);
            res.json(restBooking);
        })
        
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('everything is ok');
})
app.listen(port, () => {
    console.log('server running port on', port);
})