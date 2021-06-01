const express = require("express");
const { User } = require("./user.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
