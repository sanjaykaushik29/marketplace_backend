import { Response } from "express";
import { UserRequest } from "../../../Interface/userInterface";
const Trade = require('../../model/trade.model')

export const getTrades = async (req: UserRequest, res: Response) => {
    try {  
        const page = req.query.page || 1
        const limit = req.query.limit || 3
        const skip = (Number(page) - 1) * Number(limit)
        const nftId = req.body.nftId

        if(!nftId) return  res.status(400).send({message: "nftId is required" })
        const responseCount = await Trade.find({nftId: nftId}).count()
        const response = await Trade.find({nftId: nftId}).populate('from', 'lastName firstName nickName wallet_address').populate('nftId').populate('to', 'lastName firstName nickName wallet_address').skip(skip).limit(Number(limit))
        if (response) res.status(201).send({ data: response, count: responseCount, message: "Offer Added sucessfully" })
        } 
        catch (error: any) {
        console.log(error)
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}