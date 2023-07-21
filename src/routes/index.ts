
const apiRouter = require('express').Router();

const userRoutes = require("./userRoute")
const nftRoutes = require("./nftRoutes")
const collectionRoutes = require("./collection")
const tradesRouter = require("./trade")

apiRouter.use('/user', userRoutes)
apiRouter.use('/nft', nftRoutes)
apiRouter.use('/colletion', collectionRoutes)
apiRouter.use('/trade', tradesRouter)

module.exports = apiRouter;
