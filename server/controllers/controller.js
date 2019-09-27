const mongoose = require('mongoose');
const User = mongoose.model("User");
const Team = mongoose.model("Team");
const Match = mongoose.model("Match");

// bcrypt 
const bcrypt = require('bcryptjs');

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
        // skip CF or FC when searching through twitter
        // team_name = team_name.replace('CF', '');
        // team_name = team_name.replace('FC', '');
        team_name = team_name.replace(/\s/g, '').toLowerCase();
        console.log("-team name for twitter search:", team_name);
        let params = {q : encodeURI(team_name), result_type : 'popular'};
        client.get(path, params, function(error, tweets, res){
            if (!error) {
                // console.log("--popular tweets: ", tweets);
                response.json({message:"success", data:tweets})
            } else {
                response.json({message:"fail", error:error});
            }
        });
    },

    // get all teams
    get_teams : function(request, response) {
        Team.find()
            .then(teams => {
                response.json({message:'success', data: teams})
            })
            .catch(err => {
                response.json({message:"fail", error:err});
            })
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
    },

    // check if user logged in or not
    is_user_logged_in : function(request, response) {
        if (request.session.email) {// it has email in session 
            response.json({loggedin: true, 
                email: request.session.email, 
                user_name: request.session.user_name
            });
        } else {
            response.json({loggedin: false});
        }
    },

    // add user
    add_user : function(request, response) {
        let pw = request.body.password;
        let new_user = request.body;
        if (new_user.password != new_user.confirm_password) {
            response.json({message:"fail", error:"Password Should Match"})
        } else if (new_user.password.length < 8) {
            response.json({message:"fail", error:"Password Requires 8 characters"})
        } else {
            bcrypt.hash(pw, 10) 
            .then(hashed_password => {
                new_user['password'] = hashed_password;
                // check if email is already taken
                User.find({email:new_user.email})
                    .then(users => {
                        if (users.length > 0) {
                            response.json({message:"fail", error:"User Email Already Exists"})
                        } else {
                            // create new user
                            User.create(new_user)
                            .then(newUser => {
                                // save in session
                                request.session.email = newUser.email;
                                request.session.user_name = newUser.first_name;
                                response.json({message:"success", data:newUser});
                            })
                            .catch(err => {
                                response.json({message:"fail", error:err});
                            })
                        }
                    })
                    .catch(err => {
                        response.json({message:"fail", error:"Registration Error"})
                    })
            })
            .catch(err => {
                console.log('--hash failed', err);
                response.json({message:"fail", error:err});
            })
        }
    },

    // user login
    user_login : function(request, response) {
        console.log("-user_login at controller with data:", request.body);
        // request.session.email = Math.floor(100*Math.random());
        // response.json({message:'success'});
        // request.session.email = request.body.email;
        // request.session.user_name = request.body.first_name;
        // request.session.favorite_team = request.body.favorite_team;
        User.findOne({email : request.body.email})
            .then(user => {
                let hashed_pw = user.password;
                console.log("--compare:", hashed_pw, " vs. ",request.body.password);
                bcrypt.compare(request.body.password, hashed_pw)
                    .then(result => {
                        if (result) {
                            console.log("-passwrod matches, ",result);
                            //login
                            request.session.email = request.body.email;;
                            request.session.user_name = request.body.first_name;
                            response.json({message:"success"})
                        } else { // wrong password
                            console.log("--password not matching");
                            response.json({message:"fail", error: "Incorrect Account Information"})
                        }
                    })
                    .catch(err => {
                        // console.log("--password not matching");
                        response.json({message:"fail", error:"Login Error"});
                    })
            })
            .catch(err => {
                console.log("--no user information");
                response.json({message:"fail", error:"Account Not Exists"});
            })
    },

    // get user
    get_user : function(request, response) {
        let email = request.params.email;
        User.findOne({email : email})
            .then(user => {
                response.json({message:"success", data:user});
            })
            .catch(err => {
                response.json({message:"fail", error:err});
            })
    },

    // get users
    get_users : function(request, response) {
        User.find({})
            .then(users => {
                response.json({message:"success", data:users});
            })
            .catch(err => {
                response.json({message:"fail", error:err});
            })
    },

    // update favorite team for user
    update_favorite_team : function(request, response) {
        let email = request.params.email;
        User.findOneAndUpdate({email: email},
            {$set : {favorite_team : request.body.team}},
            {runValidators: true, new:true})
            .then(editedUser => {
                response.json({message:"success", data:editedUser})
            })
            .catch(err => {
                response.json({message:"fail", error:err})
            })
    },

    // logoff user
    logoff_user : function(request, response) {
        console.log("-logging off at controller");
        request.session.destroy(function(err) {
            if (err) {
                console.log("-------error: ", err);
                response.json({message:"fail"});
            }
            // response.redirect('/');
            response.json({message:"success"});
        });
    },

    // let user change setting
    change_setting : function(request, response) {
        let flag = request.body.flag;
        console.log("--changing setting to : ", flag);
        request.session.setting_change = flag;
        response.json({message:"success", setting_change:request.session.setting_change});
    },

    // get setting_change in request.session
    get_change_setting : function(request, response) {
        response.json({message:"success", setting:request.session.setting_change});
    }


}