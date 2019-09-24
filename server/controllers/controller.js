const mongoose = require('mongoose');
const User = mongoose.model("User");
// const Team = mongoose.model("Team");

// for twitter api
const Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'rNnHnvJONepz11IgurzxeVIt7',
    consumer_secret: 'O7vinTpiCi9iqZNExZdWiPhvg80BUZOlRVHuUlN83xVxoQTONK',
    bearer_token:'AAAAAAAAAAAAAAAAAAAAAEWIAAEAAAAAl6RN%2FEmRhI9S0OhD3aOGqn601mc%3DAZMnXdG9CWrwG3tymXVXzKFDmNI3Hi0pRvOT6lgF7R1KaSh59d'
  });

module.exports = {
    
    // get recent twitter data with teamname in hashtag
    get_recent_tweets : function(request, response) {
        let team_name = request.params.team_name;
        console.log("--getting recent twitter data for:", team_name);
        let path = `https://api.twitter.com/1.1/search/tweets.json`;
        let params = {q : encodeURI(team_name.replace(/\s/g, '').toLowerCase()), result_type : 'recent'};
        client.get(path, params, function(error, tweets, res){
            if (!error) {
                response.json({message:"success", data:tweets})
            } else {
                response.json({message:"fail", error:error});
            }
        });
    },

    // get popular twitter data with teamname in hashtag
    get_popular_tweets : function(request, response) {
        let team_name = request.params.team_name;
        console.log("--getting recent twitter data for:", team_name);
        let path = `https://api.twitter.com/1.1/search/tweets.json`;
        let params = {q : encodeURI(team_name.replace(/\s/g, '').toLowerCase()), result_type : 'popular'};
        client.get(path, params, function(error, tweets, res){
            if (!error) {
                console.log("--popular tweets: ", tweets);
                response.json({message:"success", data:tweets})
            } else {
                response.json({message:"fail", error:error});
            }
        });
    }

}