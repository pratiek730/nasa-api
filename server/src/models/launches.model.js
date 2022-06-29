//Imports ...
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

// Constant Declaration ...
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_FLIGHT = 100;


// All Functions ...
async function populateFromSpacex () {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if(response.status != 200)
    {
        console.log('Problem downloading from SpaceX API')
        throw new Error('SpaceX data Download Failed')
    }

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs)
    {
        const payloads = launchDoc['payloads'];

        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: new Date(launchDoc['date_local']),
            customer: customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success']
        };

        console.log(`${launch.mission} :\t ${launch.rocket}`);
        await saveLaunch(launch);
    }

}

async function loadLaunchData() {
    console.log("Downloading...");
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if(firstLaunch)
    {
        console.log('Launch Data Already Loaded from SpaceX API \nMoving Ahead...');
    }
    else
    {
    await populateFromSpacex();
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId)
{
    return await  launches.findOne({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestlaunch = await launches.findOne().sort('-flightNumber');
if(!latestlaunch)
{
    return DEFAULT_FLIGHT;
}

    return latestlaunch.flightNumber;
}

async function saveLaunch(launchData){
    
    await launches.findOneAndUpdate({
        flightNumber: launchData.flightNumber
    },launchData,
    {
        upsert: true
    }
    )
} 

async function getAllLaunches(skip, limit)
{
    return await launches
    .find({},{_id: 0,__v: 0})
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launchData) {
    
    const planet = await planets.findOne({
        kepler_name: launchData.target,
    });
    if(!planet){
        throw new Error('No planet found')
    }

    const newFlight = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launchData, {
        upcoming: true,
        success: true,
        customer: ['Max', 'Anonymous'],
        flightNumber: newFlight,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId)
{
    const aborted = await launches.updateOne({
        flightNumber: launchId
    },
    {
        upcoming: false,
        success: false
    })
    
    return aborted.modifiedCount === 1;
}



// The Exports ...
module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}