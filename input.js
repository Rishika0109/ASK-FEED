const express = require("express");
const { User } = require("./user.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
passport.use(new GoogleStrategy({
  clientID: '652161168885-sev8msh3qtemn2nkpgecheti7g3tnduh.apps.googleusercontent.com',
  clientSecret: 'DJsIExyoeSxB4XAGxO2F8s8O',
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
app.post("/signup", async (req, res) => {
  const { username, password, email, phoneNo } = req.body;
  const userexist = await User.findOne({ email });
  if (!userexist) {
    const newUser = {
      username,
      password: bcryptjs.hashSync(password, 10),
      email,
      phoneNo,
    };
    const user = await User.create(newUser);
    res.send(user);
  } else {
    res.send("User already exist!");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userexist = await User.findOne({ email });
  if (userexist) {
    const matchpassword = await bcryptjs.compare(password,userexist.password );
    if (matchpassword) {
      res.send("login successfully!");
    } else {
      res.send("Invalid password");
    }
  } else {
    res.send("Invalid Email or password!");
  }
});

app.listen(process.env.PORT,()=>{
   console.log("server running on port 2000")
});
