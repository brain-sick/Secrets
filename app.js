//jshint esversion:6
require("dotenv").config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) console.log(err);
    else {
      const user = new User({
        name: req.body.username,
        password: hash,
      });
      user.save(function (err) {
        if (err) console.log(err);
        else res.render("secrets");
      });
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ name: username }, function (err, foundUser) {
    if (err) console.log(err);
    else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password).then(function (result) {
          if (result == true) {
            res.render("secrets");
          }
        });
      } else {
        res.send("User not found");
      }
    }
  });
});
app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
