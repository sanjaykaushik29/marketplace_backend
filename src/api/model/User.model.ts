const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    email: { type: String },
    bio: { type: String },
    nickName: { type: String },
    links: { type: String },
    twitterLink: { type: String },
    telegramLink: { type: String },
    instagramLink: { type: String },
    wallet_address: { type: String, required: [true, "Provide a wallet address"], unique: [true, "Account already exist with this wallet Address"], lowercase: true },
    coverImage: { type: String },
    profileImage: { type: String }
}, { timestamps: true },
)

const User = mongoose.model("User", userModel)
module.exports = User
