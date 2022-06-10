const http = require('http');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.module');


PORT = process.env.PORT || 8000 ;
const MONGO_URL = 'mongodb+srv://nasa-api:sf8FctdeVqPf3dHn@cluster0.gwqkoxh.mongodb.net/?retryWrites=true&w=majority'


const app = require('./app');
const server = http.createServer(app);


mongoose.connection.once('open', () => {
    console.log('Mongoose connection is ready'); 
});
mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData()
    server.listen(PORT,"0.0.0.0", () => {
        console.log(`Listening on port ${PORT}...`);
    }); 
}

startServer();


