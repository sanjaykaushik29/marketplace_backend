const mongooseCollection = require("mongoose")

const CollectionModel = mongooseCollection.Schema({
    collectionName: { type: String, required: true },
    symbol: { type: String, required: true },
    category : { type: String, required: true },
    contractAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    description: { type: String, required: true },
    logoUri :{type: String},
    image: { type: String },
    chainId : {type: Number, required: true },
    userId: { type: mongooseCollection.Schema.Types.ObjectId, ref: "User", required: true },
    status: {type: Boolean, default: true}
}, { timestamps: true })

const collection = mongooseCollection.model("Collection", CollectionModel)
module.exports = collection