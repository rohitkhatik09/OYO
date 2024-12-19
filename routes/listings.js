const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing")
const { listingSchema } = require("../schema.js")
const expressError = require("../utils/expressError.js")


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
})
)

//Create new 
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //     throw new expressError(400, result.error)
    // }
    const newList = Listing(req.body.listing);
    await newList.save();
    req.flash("success", "Added new Listing successfully")
    res.redirect("/listings")
}))

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listDetail = await Listing.findById(id).populate("reviews");
    if (!listDetail) {
        req.flash("error", "Listing You requested for may be NOT avialabe or deleted by owner")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listDetail })
}))


//EDIT route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You requested for may be NOT avialabe or deleted by owner")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}))

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Edited")
    res.redirect(`/listings/${id}`)
})
)


//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}))

module.exports = router;