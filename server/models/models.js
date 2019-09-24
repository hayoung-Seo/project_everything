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
// const TeamSchema = new mongoose.Schema({
//     team_name = {type:String, required: [true, "Team name is required"], minlength:[2, "Team name should be at least 2 characters"]},
// })

mongoose.model("User", UserSchema);
// mongoose.model("Team", TeamSchema);