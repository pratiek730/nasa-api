const http = require('http');
const { loadPlanetsData } = require('../models/planets.module');
const app = require('./app');
PORT = process.env.PORT || 8000 ;
const server = http.createServer(app);


async function startServer(){
    await loadPlanetsData()
    server.listen(PORT,"0.0.0.0", () => {
        console.log(`Listening on port ${PORT}...`);
    }); 
}

startServer();


