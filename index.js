const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();
const app = express();
const port = 5000;

// Middlewares - Middleware allow us to parse the data coming from the frontend in json format, allows JSON Parsing.
app.use(express.json());
app.use(cors());


// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`)
})
