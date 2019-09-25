// models
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {type:String, required: [true, "First name is required"], minlength:[2, "First name should be at least 2 characters"]},
    last_name: {type:String, required: [true, "Last name is required"], minlength:[2, "Last name should be at least 2 characters"]},
    email : {type:String, required: [true, "Email is required"], minlength:[3, "Email should be at least 3 characters"]},
    password : {type:String, required: [true, "Password is required"], minlength:[8, "Email Password be at least 8 characters"]},
    favorite_team : {type: String}
}, {timestamps: true})


// TODO : build team schema once decided what kind of data to store in it.
const TeamSchema = new mongoose.Schema({
    team_name : {type:String, required: [true, "Team name is required"], minlength:[2, "Team name should be at least 2 characters"]},
    team_name_abb : {type:String, required: [true, "Team abb name is required"], minlength:[2, "Team abb name should be at least 2 characters"]},
    schedule_search_name : {type:String, required: [true, "Team schedule search name is required"], minlength:[2, "Team schedule search name should be at least 2 characters"]},
    img_url : {type:String}
}, {timestamps: true})


// match data
const MatchSchema = new mongoose.Schema({
    index : {type:String},
    team_name: {type:String},
    team_name_abb:{type:String},
    match_date:{type:String},
    vs_or_at:{type:String},
    opp_team_abb:{type:String},
    opp_team_img_url:{type:String},
    finished:{type:String},
    w_or_l:{type:String},
    score_team:{type:String},
    score_opp:{type:String},
    league:{type:String}
})

mongoose.model("User", UserSchema);
mongoose.model("Team", TeamSchema);
mongoose.model("Match", MatchSchema);