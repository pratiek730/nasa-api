const http = require('http');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.module');


PORT = process.env.PORT || 8000 ;
const MONGO_URL = 'mongodb://nasa-api:sf8FctdeVqPf3dHn@ac-35d0idq-shard-00-00.gwqkoxh.mongodb.net:27017,ac-35d0idq-shard-00-01.gwqkoxh.mongodb.net:27017,ac-35d0idq-shard-00-02.gwqkoxh.mongodb.net:27017/?ssl=true&replicaSet=atlas-8k6va9-shard-0&authSource=admin&retryWrites=true&w=majority'


const app = require('./app');
const { loadLaunchData } = require('./models/launches.model');
const server = http.createServer(app);


mongoose.connection.once('open', () => {
    console.log('Mongoose connection is ready'); 
});
mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer(){
    await mongoose.connect(MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,"0.0.0.0", () => {
        console.log(`Listening on port ${PORT}...`);
    }); 
}

startServer();


