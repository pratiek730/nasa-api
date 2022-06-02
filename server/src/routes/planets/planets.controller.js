const { planets } = require("../../../models/planets.module");



function httpGetAllPlanets(req, res)
{
    return res.status(200).json(planets);
}


module.exports = {
    httpGetAllPlanets,
};