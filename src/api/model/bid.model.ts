const mongooseBid = require('mongoose');
const Schema = mongooseBid.Schema;

const bidSchema = new Schema({
    userId: { type: mongooseBid.Schema.Types.ObjectId, ref: "User", required: true },
    nftId: { type: mongooseBid.Schema.Types.ObjectId, ref: "NFT", required: true },
    amount: { type: String, default: null },
}, { timestamps: true });

const Bid = mongooseBid.model('Bid', bidSchema);
module.exports = Bid
