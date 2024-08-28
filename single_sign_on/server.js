const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoClient = require("mongodb");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const User = require("./schema");
require("./passport-setup");
const router = express.Router();
const app = express();

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

const url ="mongodb://127.0.0.1:27017/AccessUsers";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
})
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/manage");
  }
);
const requireAuth = async (req, res, next) => {
  let existingUser;
  if (req.user) {
    existingUser = await User.findOne({ _id: req.user });
  }
  if (existingUser ? existingUser["isAllowed"] : false) {
    req.authUser = existingUser;
    next();
  } else if (existingUser ? existingUser["isAllowed"] == false : false) {
    return res.status(401).send("WAITING FOR ADMIN APPROVAL");
  } else if (!req.user) {
    res.redirect("/auth/google");
  }
};
app.use("/manage", requireAuth);

app.get("/manage", requireAuth, (req, res) => {
  res.send({user:"welcome to your appplication"})
});

const port = 4001;
const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1h",
  redirect: false,
  setHeaders(res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};
app.use(express.static(path.join(__dirname, "static"), options));
// app.use(express.static('public', options));
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.get("/", (req, res) => {
  return res.send(`ABHA Apis available`);
});
app.get("/api/", (req, res) => {
  return res.send("You have reached right direction to call API's ");
});

app.listen(port, async () => {
  try {
    console.log("Service up and running");
  } catch (err) {
    console.log(err.message, "error");
  }
});
