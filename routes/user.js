const express = require("express")
const router = express.Router()
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email: email,
            username: username
        })
        const registerdUser = await User.register(newUser, password);
        req.flash("success", "Welcome to OYO")
        res.redirect("/listings")
    } catch (error) {
        req.flash("error", error.message + (" Try another Username"));
        res.redirect("/signup")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post('/login',
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        let { username } = req.body;
        req.flash("success", `Welcome to OYO @${username}`)
        res.redirect("/listings");
    })

module.exports = router;