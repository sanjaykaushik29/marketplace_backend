import { Request ,Response } from "express";
import { UserRequest } from "../../../Interface/userInterface";
const Collection = require('../../model/collection.model')

export const createCollection = async (req: UserRequest, res: Response) => {
    try {  
        const collectionName = req.body.collectionName
        const symbol = req.body.symbol
        const category = req.body.category
        const transactionHash = req.body.transactionHash
        const description = req.body.description
        const contractAddress = req.body.contractAddress
        const chainName = req.body.chainName
        const chainValue = req.body.chainValue
        if(!collectionName) return  res.status(400).send({message: "collection name is required" })
        if(!symbol) return  res.status(400).send({message: "symbol is required" })
        if(!category) return  res.status(400).send({message: "category is required" })
        if(!transactionHash) return  res.status(400).send({message: "transactionHash is required" })
        if(!description) return  res.status(400).send({message: "description is required" })
        if(!contractAddress) return  res.status(400).send({message: "contractAddress is required" })
        if(!chainName) return  res.status(400).send({message: "chainName is required" })
        if(!chainValue) return  res.status(400).send({message: "chainValue is required" })
        req.body.userId = req.user._id

        const payload = { ...req.body}

        let contractdata = await Collection.findOne({contractAddress: contractAddress})
        
        if (!contractdata){
        const collection = new Collection(payload)
        const response = await collection.save()
            if (response) res.status(201).send({ data: response, message: "createCollection: Collection Added Sucessfully" })
            else res.status(400).send({ message: "Somethig Went wrong" })
        }
        else res.status(200).send({ message: "Collection is already created!"})
    }
        catch (error: any) {
        console.log(error)
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
        
        const responseCount = await Collection.find({status: true}).count()
        const response = await Collection.find({status: true}).skip(skip).limit(Number(limit))
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