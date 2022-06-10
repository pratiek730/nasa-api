const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
// const launches = new Map();

const DEFAULT_FLIGHT = 100;

const launch = {
    flightNumber: 100,
    mission: "kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date('December 27, 2030'),
    target: "Kepler-442 b",
    customer: ["Max", "Anonymous"],
    upcoming: true,
    success: true
}

saveLaunch(launch);

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
    const planet = await planets.findOne({
        kepler_name: launchData.target,
    });
    if(!planet){
        throw new Error('No planet found')
    }
    await launches.findOneAndUpdate({
        flightNumber: launchData.flightNumber
    },launchData,
    {
        upsert: true
    }
    )
} 

async function getAllLaunches()
{
    return await launches.find({},{
        _id: 0,
        __v: 0
    });
}


async function scheduleNewLaunch(launchData) {

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

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}