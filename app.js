const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const expressError = require("./utils/expressError.js")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js")

const app = express();

app.engine("ejs", ejsMate)

app.use(cookieParser("secret"))
const sessionOption = {
    secret: "mysecret"
}
app.use(session({ sessionOption }))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error");
    next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(morgan('dev'));
app.use(cookieParser("secret"))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


const MONGO_URL = "mongodb://127.0.0.1:27017/oyo";

main()
    .then(() => {
        console.log("connected to db");
    }).catch((err) => {
        console.log(err);
    })

async function main() {
    mongoose.connect(MONGO_URL)
}

app.get("/", (req, res) => {
    res.send("I am root");
})

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "rohit@gmail.com",
        username: "rohitOP"
    })
    let registerdUser = await User.register(fakeUser, "rohitKhatik")
    res.send(registerdUser);
})

// for listings
app.use("/listings", listingRouter);

// for Reviews
app.use("/listings/:id/reviews/", reviewRouter);

//for userRouter
app.use("/", userRouter)


app.use("*", (req, res, next) => {
    next(new expressError(404, "Page NOT Found!!!"));
})

app.use((err, req, res, next) => {
    let { stausCode = 500, message = "Something Went Wrong" } = err;
    res.status(stausCode).render("error.ejs", { err })
})

const port = 3000;
app.listen(port, () => {
    console.log(`app is listning on ${port}`);
})