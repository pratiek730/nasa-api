const launches = new Map();

let latestFlightNumber = 100;

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

function existsLaunchWithId(launchId)
{
    return launches.has(launchId);
}

launches.set(launch.flightNumber, launch);

function getAllLaunches()
{
    return Array.from(launches.values());
}

function addNewLaunch(launch)
{
    latestFlightNumber++;
    
    launches.set(latestFlightNumber, Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ['Max', 'Anonymous'],
        flightNumber: latestFlightNumber,
    }));
}




function abortLaunchById(launchId)
{
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
    
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}