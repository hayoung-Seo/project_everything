// import controller
const controller = require('../controllers/controller');
const path = require('path');

module.exports = function(app) {
    // get recent twitter data with teamname in hashtag
    app.get('/twitter/recent/:team_name', controller.get_recent_tweets);

    // get popular twitter data with teamname in hashtag
    app.get('/twitter/popular/:team_name', controller.get_popular_tweets);

    // get all teams
    app.get('/teams', controller.get_teams);

    // get team's information from mongodb
    app.get('/teams/:team_name', controller.get_team_data);

    // get matches of the team from mongodb
    app.get('/matches/:team_name', controller.get_team_matches);

    // login user
    app.post('/login', controller.user_login);

    // check if user logged in
    app.get('/login', controller.is_user_logged_in);

    // add user
    app.post('/users', controller.add_user);

    // get user
    app.get('/users/:email', controller.get_user);

    // update favorite team for user
    app.patch('/users/:email', controller.update_favorite_team);

    // logoff user
    app.get('/logoff', controller.logoff_user);

    // let user change setting
    app.post('/settings/change', controller.change_setting);

    // get setting_change in request.session
    app.get('/settings/get', controller.get_change_setting);
}