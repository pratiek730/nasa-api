const express = require('express');

const cors = require('cors');
const app = express();
const path = require('path');
const api = require('./routes/api');


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,'..','public')));

app.use("/v1",api);



app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})



module.exports = app;