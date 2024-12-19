const express = require("express")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()

app.set("view engine", "ejs");

app.use(cookieParser("secret"))
const sessionOption = {
    secret: "mysecret"
}
app.use(session({sessionOption}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.sumsg = req.flash("success")
    res.locals.ermsg = req.flash("error")
    next()
})

app.get("/register", (req, res) => {
    let { name = "bhoot" } = req.query;
    req.session.name = name;
    if (name == "bhoot") {
        req.flash("error", "user not registerd")
    } else {
        req.flash("success", "user registerd suck")
    }
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    res.render("index.ejs", { name: req.session.name })
})

// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You visited this site ${req.session.count} time`)
// })

// app.get("/", (req, res) => {
//     console.log(req.signedCookies.name)
//     let name;
//     req.signedCookies.name ? name = req.signedCookies.name : name = "world"
//     res.send(`madeIN ${req.signedCookies.madeIn}`)
// })

// app.get("/getCookie", (req, res) => {
//     res.cookie("greet", "namaste", { signed: true })
//     res.cookie("madeIn", "India", { signed: true })
//     console.log(req.signedCookies)
//     res.send("Sending Cookie")
// })

const port = 3000;
app.listen(port, () => {
    console.log(`app is listninig on port ${port}`)
})