const http = require('http');
const { loadPlanetsData } = require('./models/planets.module');
require('dotenv').config();


PORT = process.env.PORT || 8000 ;


const app = require('./app');
const { loadLaunchData } = require('./models/launches.model');
const { mongoConnect } = require('./services/mongo');
const server = http.createServer(app);




async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,"0.0.0.0", () => {
        console.log(`Listening on port ${PORT}...`);
    }); 
}

startServer();


