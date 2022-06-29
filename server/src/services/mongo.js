const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://nasa-api:sf8FctdeVqPf3dHn@ac-35d0idq-shard-00-00.gwqkoxh.mongodb.net:27017,ac-35d0idq-shard-00-01.gwqkoxh.mongodb.net:27017,ac-35d0idq-shard-00-02.gwqkoxh.mongodb.net:27017/?ssl=true&replicaSet=atlas-8k6va9-shard-0&authSource=admin&retryWrites=true&w=majority'


mongoose.connection.once('open', () => {
    console.log('Mongoose connection is ready'); 
});
mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect ()
{
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
}


module.exports = {
    mongoConnect,
}