import { Response } from "express";
import { UserRequest } from "../../../Interface/userInterface";
const Bid = require('../../model/bid.model')
const NFT = require('../../model/Nft.model')
const NFT_History = require('../../model/HistoryNft.model')
import * as NFTController from "../../controller/NFTController/nft.controller";

export const addBid = async (req: UserRequest, res: Response) => {
    try {
        const { nftId, amount } = req.body
        const payload = {
            nftId,
            amount,
            userId: req.user._id
        }

        const find = await NFT.findOne({ _id: nftId })
        const error = !find ? "Nft not found" : find.price >= amount ? "Bid amount can't be less then previous one or bid price" : null
        if (error) return res.status(400).send({ message: error })

        const bid = new Bid(payload)
        const response = await bid.save()

        await NFT.findOneAndUpdate({ _id: nftId }, {
            price: amount,
            bidUserId: req.user._id,
            totalBid: find.totalBid + 1
        }, { new: true })

        // Add History
        const history = new NFT_History({
            nftId: nftId,
            userId: req.user._id,
            actionType: 6
        })
        await history.save()

        if (req.user._id) {
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }

            //Add Trade in Mint Time.
            await NFTController.tradeEvent(res, req.user._id, null, response._id, amount, "Offer")
        }

        // await NFTController.tradeEvent()

        if (response) res.status(201).send({ data: response, message: "Bid added sucessfully" })
        else res.status(400).send({ message: "Somethig Went wrong" })

    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}


export const getTotalBids = async (req: UserRequest, res: Response) => {
    try {  
        req.body.userId = req.user._id

        const page = req.query.page || 1
        const limit = req.query.limit || 3
        const skip = (Number(page) - 1) * Number(limit)
        const nftId = req.body.nftId
        
        const responseCount = await Bid.find({nftId: nftId}).count()
        const response = await Bid.find({nftId: nftId}).skip(skip).limit(Number(limit))
        if (response) res.status(201).send({ data: response, count: responseCount, message: "Bids details" })
        else res.status(400).send({ message: "Somethig Went wrong" })
    }
    catch (error: any) {
        console.log(error)
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}