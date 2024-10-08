const path = require("path");
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const MongoDbStore = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
require("dotenv").config()
const errorHandler = require("./middlewares/errorHandler")
const AuthRoute = require("./routes/auth")
const PostRoute = require("./routes/post")
const UserRoute = require("./routes/user")
const TagRoute = require("./routes/tag")
const NotificationRoute = require("./routes/notification")


require("./utils/createDefaultTags")
require("./utils/createDefaultPosts")

require("./config/passport-config");

const app = express()

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.json())


const store = new MongoDbStore({
    uri: MONGO_URL,
    collection: "session"
})

const ONE_DAY = 1000 * 60 * 60 * 24
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: ONE_DAY,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());



app.use("/api/auth", AuthRoute)
app.use("/api/notifications", NotificationRoute);
app.use("/api/posts", PostRoute)
app.use("/api/users", UserRoute)
app.use("/api/tags", TagRoute)


const root = path.resolve()
app.use(express.static(path.join(root, "/frontend/dist")))
app.get("*", (req, res, next) => {
  console.log(req.protocol, req.get("host"))
  res.sendFile(path.join(root, "frontend", "dist", "index.html"))
})

app.use(errorHandler)

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("Connected to MongoDb...");
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
})
.catch(error => {
    console.log("Unable to connect to MongoDb...");
    console.log(error);
})


