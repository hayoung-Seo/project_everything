// import controller
const controller = require('../controllers/controller');
const path = require('path');

module.exports = function(app) {
    // get recent twitter data with teamname in hashtag
    app.get('/twitter/recent/:team_name', controller.get_recent_tweets);

    // get popular twitter data with teamname in hashtag
    app.get('/twitter/popular/:team_name', controller.get_popular_tweets);

    // get team's information from mongodb
    app.get('/team/:team_name', controller.get_team_data);

    // get matches of the team from mongodb
    app.get('/matches/:team_name', controller.get_team_matches);
}