const mongoose = require('mongoose');
const User = mongoose.model("User");
const Team = mongoose.model("Team");
const Match = mongoose.model("Match");

// const db = mongo.connect('mongodb://localhost/project_everything', function(err, response){  
//    if(err){ console.log( err); }  
//    else{ console.log('Connected to ' + db, ' + ', response); }  
// });  

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
        // console.log("--getting recent twitter data for:", team_name);
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
        // console.log("--getting recent twitter data for:", team_name);
        let path = `https://api.twitter.com/1.1/search/tweets.json`;
        let params = {q : encodeURI(team_name.replace(/\s/g, '').toLowerCase()), result_type : 'popular'};
        client.get(path, params, function(error, tweets, res){
            if (!error) {
                // console.log("--popular tweets: ", tweets);
                response.json({message:"success", data:tweets})
            } else {
                response.json({message:"fail", error:error});
            }
        });
    },

    // get team data from mongodb
    get_team_data : function(request, response) {
        let team_name = request.params.team_name;
        console.log("--teamname", team_name);
        Team.findOne({"team_name": team_name})
            .then(team => {
                response.json({message:"success", data:team})
            })
            .catch(err => {
                response.json({message:"fail", error:err});
            })
    },

    // get matches of the team from mongodb
    get_team_matches : function(request, response) {
        let team_name = request.params.team_name;
        Team.findOne({"team_name": team_name})
            .then(team => {
                let team_abb = team.team_name_abb;
                console.log("--searching matches for ", team_abb);

                Match.find({team_name_abb:team_abb}).sort("index")
                    .then(matches => {
                        // console.log("--got matches:", matches);
                        response.json({message:"success", data:matches})
                    })
                    .catch(err=> {
                        // console.log("--got error while getting the data:", err);
                        response.json({message:"fail", error:err});
                    })
            })
    }
}