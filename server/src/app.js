const express = require('express');
const planetsRouter = require('./routes/planets/planets.router');
const cors = require('cors');
const app = express();
const path = require('path');
const { launchesRouter } = require('./routes/launches/launches.router');

app.use(cors());
app.use(express.json());
app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter);
app.use(express.static(path.join(__dirname,'..','public')));

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})



module.exports = app;