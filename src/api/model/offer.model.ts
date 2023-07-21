const mongooseOffer = require("mongoose")

const offerModel = mongooseOffer.Schema({
    nftID: { type: mongooseOffer.Schema.Types.ObjectId, ref: "NFT", required: [true, "Nft Id is required"] },
    nftAddress: { type: String, lowercase: true, required: [true, "Nft address is required"] },
    offerer: { type: String, required: [true, "Offerer wallet address is required"] },
    paymentToken: { type: String, required: [true, "Payment Token is required"] },
    tokenId: { type: String, required: [true, "Token is required"] },
    price: { type: String, required: [true, "Offer price is required"] },
    startTime: { type: String, required: [true, "Start time is required"] },
    expireTime: { type: String, required: [true, "End time is required"] },
    signature: { type: String, required: [true, "Signature is required"] },
    nftOwner: { type: String, required: [true, "Signature is required"] }
}, { timestamps: true },
)

const Offer = mongooseOffer.model("Offer", offerModel)
module.exports = Offer
