const mongooseTraits = require('mongoose');

const traitsSchema = mongooseTraits.Schema({
    nftId: { type: mongooseTraits.Schema.Types.ObjectId, ref: "NFT", required: true },
    name: { type: String, required: true },
    value: { type: String, required: true }
}, { timestamps: true })

const Trait = mongooseTraits.model("trait", traitsSchema)
module.exports = Trait
