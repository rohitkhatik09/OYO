const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // image: {
    //     type: String,
    //     required :true,
    //     default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set: (v) => v === " " ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
    // },
    // image: {
    //     type: String,
    //     default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set: (v) => v === " " ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
    //     match: /^https?:\/\/.+/, // Ensure it's a valid URL
    // },
    // image: {
    //     filename: {
    //         type: String,
    //     },
    //     url: {
    //         type: String,
    //         default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //         set: (v) => v === " " ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
    //         match: /^https?:\/\/.+/, // Ensure it's a valid URL
    //     },
    // },
    image: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.eBcsCRi3dx-Gz-CzjGAZRgHaEK?rs=1&pid=ImgDetMain",
        set: (v) => {
            return (!v || v.trim() === " ")
                ? "https://th.bing.com/th/id/OIP.eBcsCRi3dx-Gz-CzjGAZRgHaEK?rs=1&pid=ImgDetMain"
                : v;
        },
        match: /^https?:\/\/[^\s$.?#].[^\s]*$/, // Improved regex for a valid URL
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    price: Number,
    location: String,
    country: String,
})


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;