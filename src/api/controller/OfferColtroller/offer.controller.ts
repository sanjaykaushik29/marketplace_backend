import { Response } from "express"
import { UserRequest } from "../../../Interface/userInterface"
const Offer = require('../../model/offer.model')
const NFT = require('../../model/Nft.model')
const NFT_History = require('../../model/HistoryNft.model')


export const makeOffer = async (req: UserRequest, res: Response) => {
    try {
        const nftID = req.body.nftID
        const nftAddress = req.body.nftAddress
        const offerer = req.body.offerer
        const paymentToken = req.body.paymentToken
        const tokenId = req.body.tokenId
        const price = req.body.price
        const startTime = req.body.startTime
        const expireTime = req.body.expireTime
        const signature = req.body.signature
        const nftOwner = req.body.nftOwner

        if(!offerer) return  res.status(400).send({message: "offerer is required" })
        if(!nftAddress) return  res.status(400).send({message: "nftAddress is required" })
        if(!nftID) return  res.status(400).send({message: "nftID is required" })
        if(!paymentToken) return  res.status(400).send({message: "paymentToken is required" })
        if(!tokenId) return  res.status(400).send({message: "tokenId is required" })
        if(!price) return  res.status(400).send({message: "price is required" })
        if(!startTime) return  res.status(400).send({message: "startTime is required" })
        if(!expireTime) return  res.status(400).send({message: "expireTime is required" })
        if(!signature) return  res.status(400).send({message: "signature is required" })
        if(!nftOwner) return  res.status(400).send({message: "nftOwner is required" })

        const nftResponse = await NFT.findOne({ _id: req.body.nftID })
        if (!nftResponse) return res.status(400).send({ message: "Nft not found" })
        const payload = { ...req.body, ["nftOwner"]: nftResponse?.owner }
        const offer = new Offer(payload)
        const response = await offer.save()

        // Add History
        const history = new NFT_History({
            nftId: req.body.nftID,
            userId: req.user._id,
            actionType: 7 // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
        })
        await history.save()

        if (response) res.status(201).send({ data: response, message: "Offer Added sucessfully" })
        else res.status(400).send({ message: "Somethig Went wrong" })
    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const getCollection = async (req: UserRequest, res: Response) => {
    try {  
        req.body.userId = req.user._id

        const page = req.query.page || 1
        const limit = req.query.limit || 3
        const skip = (Number(page) - 1) * Number(limit)
        
        const responseCount = await Offer.find({nftID: req.params.nftID}).count()
        const response = await Offer.find({nftID: req.params.nftID}).skip(skip).limit(Number(limit))
        if (response) res.status(201).send({ data: response, count: responseCount, message: "Offer Added sucessfully" })
        else res.status(400).send({ message: "Somethig Went wrong" })
        } 
        catch (error: any) {
        console.log(error)
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}