const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require("./utils/expressError.js")
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js")
const { reviewSchema } = require("./schema.js");
const { error } = require("console");

const app = express();

app.engine("ejs", ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(morgan('dev'));

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}

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
    res.send("I am root")
})

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
})
)

//Create new 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //     throw new expressError(400, result.error)
    // }
    const newList = Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings")
}))

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listDetail = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listDetail })
}))


//EDIT route
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
})
)


//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))

// Review
// Post Reeviw route
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("Review Saved")
    res.redirect(`/listings/${id}`)
}))

// Delete Review route
app.delete("/listings/:id/reviews/:review_id", wrapAsync(async (req, res) => {
    let { id, review_id } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`)
}))



app.use("*", (req, res, next) => {
    next(new expressError(404, "Page NOT Found!!!"));
})

app.use((err, req, res, next) => {
    let { stausCode = 500, message = "Something Went Wrong" } = err;
    // res.status(stausCode).send(message);
    res.status(stausCode).render("error.ejs", { err })
})

const port = 3000;
app.listen(port, () => {
    console.log(`app is listning on ${port}`);
})