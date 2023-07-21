const mongooseNft = require("mongoose")

const NftHistoryModel = mongooseNft.Schema({
    nftId: { type: mongooseNft.Schema.Types.ObjectId, ref: "NFT", required: true },
    userId: { type: mongooseNft.Schema.Types.ObjectId, ref: "User", required: true },
    oldUserId: { type: mongooseNft.Schema.Types.ObjectId, ref: "User", default: null },
    actionType: { type: Number,default:null } // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
}, { timestamps: true })

const NFT_History = mongooseNft.model("NFT_History", NftHistoryModel)
module.exports = NFT_History
