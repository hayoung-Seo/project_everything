// import controller
const controller = require('../controllers/controller');
const path = require('path');

module.exports = function(app) {
    // get recent twitter data with teamname in hashtag
    app.get('/twitter/recent/:team_name', controller.get_recent_tweets);

    // get popular twitter data with teamname in hashtag
    app.get('/twitter/popular/:team_name', controller.get_popular_tweets);
}