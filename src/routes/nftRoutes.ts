import * as NFTController from "../api/controller/NFTController/nft.controller";
import { auth } from "../api/services/auth.services";
import * as BidController from "../api/controller/BidController/bid.controller";
import * as OfferController from "../api/controller/OfferColtroller/offer.controller";

const nftRouter = require('express').Router();


nftRouter.post('/create-nft/', auth, NFTController.createNFT)
nftRouter.get('/', NFTController.getNFTs)
nftRouter.post('/create-lazymint-nft/', auth, NFTController.createNFTforLazyMint)
nftRouter.patch('/put-nft-onsell/:nftId', auth, NFTController.putNFTonSell)
nftRouter.patch('/transfer-nft/:nftId', auth, NFTController.transferNft)
nftRouter.get('/nft-details/:nftId', NFTController.getNFTDetailsById)
nftRouter.get('/top-nfts', NFTController.getTopNFTs)
nftRouter.get('/:walletAddress', NFTController.getNFTs)

// Bid routes
nftRouter.post('/bid/add-bid', auth, BidController.addBid)

// offer routes
nftRouter.post('/offer/make-offer', auth, OfferController.makeOffer)

module.exports = nftRouter;
