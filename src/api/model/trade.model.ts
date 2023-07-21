const mongooseTrade = require("mongoose")

const tradeSchema = mongooseTrade.Schema({
    nftId: { type: mongooseTrade.Schema.Types.ObjectId, ref: "NFT", required: true },
    from: { type: mongooseTrade.Schema.Types.ObjectId, default: null, lowercase: true},
    to: { type: mongooseTrade.Schema.Types.ObjectId, default: null, lowercase: true },
    price: { type: Number, default: 0 },
    event: { type: String ,enum: ["Minted", "Sale", "Transfer", "List", "Offer"], default: undefined}
}, { timestamps: true })

const Trade = mongooseTrade.model("Trade", tradeSchema)
module.exports = Trade