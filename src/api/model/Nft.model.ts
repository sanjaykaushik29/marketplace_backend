const mongooseNFT = require("mongoose")

const NFTModel = mongooseNFT.Schema({
    collectionId : {type: mongooseNFT.Schema.Types.ObjectId, ref: "Collection", required: true},
    name: { type: String },
    description: { type: String },
    tokenId: { type: String },
    category: { type: String, enum: ["Digital Art", "Music", "Domain Name", "Sports", "Utilities", ""], default: undefined },
    type: { type: String, enum: ["image", "video", "audio"], default: "image" },
    royalties: Number,
    image: { type: String },
    price: { type: Number, default: 0 }, // Starting Price or Highest Bid Price
    isMint: { type: Boolean, default: true },
    mintType: { type: String, enum: ["Mint", "Lazy Mint"], default: "Mint" },
    isSell: { type: Boolean, default: false },
    saleType: { type: String, enum: ["Fixed", "Auction"], default: "Fixed" },
    auctionStartDate: { type: Date, default: null },
    auctionEndDate: { type: Date, default: null },
    bidPrice: { type: Number, default: null },
    bidUserId: { type: mongooseNFT.Schema.Types.ObjectId, ref: "User" }, // User with highest Bid
    totalBid: { type: Number, default: 0 }, // Total Bids perform on NFT
    creator: { type: String, default: null, lowercase: true }, // Wallet Address
    signature: { type: String, default: null },
    owner: { type: String, default: null, lowercase: true }, // Wallet Address
    // collectionAddress: { type: String, default: null, trim: true, lowercase: true },
    external_Url: { type: String },
    token_address: { type: String },
    token_hash: { type: String },
    token_uri: { type: String },
    isComplete: { type: Boolean, default: false },
    nonce: { type: Number, default: 0 },
}, { timestamps: true },
)

const NFT = mongooseNFT.model("NFT", NFTModel)
module.exports = NFT
