import { Request, Response } from "express"
import { getNFTByTokenID } from "./moralis.controller"
import { UserRequest } from "../../../Interface/userInterface"
import { scheduleJob } from 'node-schedule'
import { lazyMintValidations } from "../../../Utils/validations"
import { String } from "aws-sdk/clients/codebuild"
const NFT = require('../../model/Nft.model')
const Coillection = require('../../model/collection.model')
const NFT_History = require('../../model/HistoryNft.model')
const User = require("../../model/User.model");
const ObjectId = require('mongoose').Types.ObjectId;
const Trait = require('../../model/traits.model')
const Trade = require('../../model/trade.model')

export const tradeEvent = async (res: Response, _from : any, _to: any, nftId: Number, price: any, tagName: String) => {
    try {
        if (_to) {
            const user = await User.findOne({ _id: _to })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }
            const trade = new Trade({
                nftId: nftId,
                from: _from,
                to: _to,
                price: price || 0,
                event: tagName
            })
            await trade.save()
        }
    } catch (error: any) {
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const createNFT = async (req: UserRequest, res: Response) => {
    try {
        const { tokenID, isSell, saleType, auctionStartDate, auctionEndDate, traits, collectionId, chainId } = req.body
        let contractAddress = null
        if (collectionId) {
            let contractdata = await Coillection.findOne({ _id: collectionId }, { contractAddress: 1 })
            if (!contractdata) {
                return res.status(500).send("createNFT: Collection not found")
            }
            contractAddress = contractdata.contractAddress
        }
        const { data, error } = await getNFTByTokenID(tokenID, contractAddress, chainId)

        if (data) {
            const payload = {
                ...data,
                isSell: isSell,
                saleType: saleType,
                auctionStartDate: auctionStartDate,
                auctionEndDate: auctionEndDate,
                bidPrice: saleType === "Auction" ? data.price : undefined,
                nonce: 1,
                collectionId: collectionId
            }
            const nft = new NFT(payload)
            const response = await nft.save()

            // Add Traits
            if (traits && traits.length) {
                const payload = traits.map((item: { type: string, value: string }) => ({ ...item, ['nftId']: response._id }))
                await Trait.insertMany(payload).then(function () {
                    console.log("Data inserted")
                }).catch(function (error: any) {
                    console.log(error)
                });
            }

            // Add History
            const history = new NFT_History({
                nftId: response._id,
                userId: req.user._id,
                actionType: 1 // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
            })
            await history.save()

            if (req.user._id) {
                const user = await User.findOne({ _id: req.user._id })
                if (!user) {
                    return res.status(500).send("createNFT: user not found")
                }

                //Add Trade in Mint Time.
                await tradeEvent(res, null, req.user._id, response._id, data.price, "Minted")
            }

            if (response) res.status(201).send({ data: response, message: "Nft created sucessfully" })
            else res.status(400).send({ message: "Something Went wrong" })
        } else {
            res.status(400).send(error)
        }
    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const getNFTs = async (req: Request, res: Response) => {
    try {
        const { category, type, limit, page } = req.query
        const skip = (Number(page) - 1) * Number(limit)
        const { walletAddress } = req.params
        let filter: any = { isComplete: false }
        // if (walletAddress) filter = { ...filter, owner: walletAddress.toLowerCase() }
        // else {
        //     if (category) filter = { ...filter, category: category }
        //     if (type) filter = { ...filter, type: type }
        // }
        const responseCount = await NFT.find(filter).count()
        const response = await NFT.find(filter).skip(skip).limit(Number(limit))
        // const response = await NFT.find(filter).limit(limit).skip(Math.floor(Number(page) * Number(limit)))
        // const response = await NFT.aggregate([
        //     { $match: filter },
        //     { $sort: { "createdAt": -1 } },
        //     { $skip: Math.floor(Number(page) * Number(limit)) },
        //     { $limit: Number(limit) },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "owner",
        //             foreignField: "wallet_address",
        //             as: "ownerDetails",
        //         }
        //     }
        // ])
        const payload = {
            total: responseCount,
            results: response,
            message: "Nft fetched sucessfully"
        }
        res.status(200).send(payload)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export const runCronJobForNFT = () => {
    try {
        scheduleJob('*/30 * * * *', async () => {
            // This will run every in every 30 mins
            const response = await NFT.find({ isComplete: false })
            response.forEach(async (item: any) => {
                const { _id, tokenId, collectionId, chainId } = item
                let contractAddress = null
                if (collectionId) {
                    let contractdata = await Coillection.findOne({ _id: collectionId }, { contractAddress: 1 })
                    contractAddress = contractdata.contractAddress
                }
                const { data, error } = await getNFTByTokenID(tokenId, contractAddress, chainId)

                // const { data, error } = await getNFTByTokenID(tokenId)
                if (!error) await NFT.findOneAndUpdate({ _id }, { ...data, ['bidPrice']: item.saleType === "Auction" ? data?.price : undefined }, { new: true })
            });
        });
    } catch (error) {
        console.log(error)
    }
}

export const createNFTforLazyMint = async (req: UserRequest, res: Response) => {
    try {
        const { body, user } = req
        const { traits } = req.body
        const { error, data } = lazyMintValidations(body, user)
        if (!data) return res.status(400).send({ message: error })
        const nft = new NFT(data)
        const response = await nft.save()

        // Add Traits
        if (traits && traits.length) {
            const payload = traits.map((item: { type: string, value: string }) => ({ ...item, ['nftId']: response._id }))
            await Trait.insertMany(payload)
        }

        // Add History
        const history = new NFT_History({
            nftId: response._id,
            userId: req.user._id,
            actionType: 1 // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
        })
        await history.save()

        //Add Trade in Mint Time.
        if (req.user._id) {
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }

            await tradeEvent(res, req.user._id, null, response._id, 0, "Minted")
        }

        if (response) res.status(201).send({ data: response, message: "Nft listed sucessfully" })
        else res.status(400).send({ message: "Something Went wrong" })
    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const putNFTonSell = async (req: UserRequest, res: Response) => {
    console.log(req.body);

    try {
        interface PAYLOAD { isSell: boolean, price?: number | string }
        const { isSell, price, } = req.body
        let payload: PAYLOAD = { isSell: Boolean(isSell) }
        if (price) payload = payload = { ...payload, ['price']: price }

        const response = await NFT.findOneAndUpdate({ _id: req.params.nftId }, payload, { new: true })

        if (req.user._id) {
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }
            const trade = new Trade({
                nftId: response._id,
                from: user.wallet_address,
                // to: user.wallet_address,
                // price : 0,
                event: "List"
            })
            await trade.save()
        }

        // Add History
        const history = new NFT_History({
            nftId: response._id,
            userId: req.user._id,
            actionType: 4 // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
        })
        await history.save()

        //Add Trade in Mint Time.
        if (req.user._id) {
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }

            await tradeEvent(res, req.user._id,null, response._id, 0, "List")
        }

        if (response) res.status(200).send({ data: response, message: "Nft updated sucessfully" })
        else res.status(400).send({ message: "Somethig Went wrong" })

    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const transferNft = async (req: UserRequest, res: Response) => {
    try {
        const { owner, oldOwner, amount} = req.body // wallet address of both

        if (!owner) return res.status(400).send({ message: "owner is required" })
        if (!oldOwner) return res.status(400).send({ message: "oldOwner is required" })
        if (!amount) return res.status(400).send({ message: "amount is required" })

        let payload = {
            owner: owner?.toLowerCase(),
            $inc: { nonce: 1 }
        }

        const response = await NFT.findOneAndUpdate({ _id: req.params.nftId }, payload, { new: true })

        // Add History
        const user = await User.findOne({ wallet_address: oldOwner?.toLowerCase() })
        const history = new NFT_History({
            nftId: response._id,
            userId: req.user._id,
            oldUserId: user._id,
            actionType: 5 // 1 = create nft, 2 = mint nft, 3 = auction, 4 = fixed price, 5 = transfer nft, 6 = bid, 7 = make offer
        })
        await history.save()

        //Add Trade in Mint Time.
        if (req.user._id) {
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(500).send("createNFT: user not found")
            }

        await tradeEvent(res, owner, req.user._id, response._id, amount, "Transfer")
        }

        if (response) res.status(200).send({ data: response, message: "Nft updated sucessfully" })
        else res.status(400).send({ message: "Somethig Went wrong" })

    } catch (error: any) {
        console.log(error)
        if (error?.message) res.status(400).send({ error: error.message })
        else res.status(500).send(error)
    }
}

export const getNFTDetailsById = async (req: Request, res: Response) => {
    try {
        const { nftId } = req.params
        const response = await NFT.aggregate([
            { $match: { _id: new ObjectId(nftId) } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "wallet_address",
                    as: "ownerDetails",
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "wallet_address",
                    as: "creatorDetails",
                }
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "_id",
                    foreignField: "nftId",
                    as: "bidsDetails",
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "bidsDetails.userId",
                    foreignField: "_id",
                    as: "bidUserDetails"
                }
            },
            {
                $addFields: {
                    bidsDetails: {
                        $map: {
                            input: "$bidsDetails",
                            in: {
                                $mergeObjects: [
                                    "$$this",
                                    {
                                        bidUserDetails: {
                                            data: {
                                                $arrayElemAt: [
                                                    "$bidUserDetails",
                                                    { $indexOfArray: ["$bidUserDetails._id", "$$this.userId"] }
                                                ],
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    bidUserDetails: "$$REMOVE"
                }
            },
            {
                $lookup: {
                    from: "traits",
                    localField: "_id",
                    foreignField: "nftId",
                    as: "traits",
                }
            },
        ])
        if (response) res.status(200).send({ data: response[0], message: "Nft details fetched sucessfully" })
        else res.status(400).send({ message: "Nft not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export const getTopNFTs = async (req: Request, res: Response) => {
    try {
        //  actionType = 5, 6, 7
        const actionTypes = [5, 6, 7]
        const response = await NFT_History.aggregate([
            { $match: { actionType: { $in: actionTypes } } },
            {
                $group: {
                    "_id": "$nftId",
                    "COUNT": { "$sum": 1 }
                }
            },
            { $sort: { "COUNT": -1 } },
            { $limit: 8 },
            {
                $lookup: {
                    from: "nfts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "nfts"
                }
            },
            { $unwind: { path: "$nfts" } },
            { $replaceRoot: { newRoot: "$nfts" } },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "wallet_address",
                    as: "ownerDetails",
                }
            }
        ])
        if (response) res.status(200).send({ data: response, message: "Top Nfts fetched sucessfully" })
        else res.status(400).send({ message: "No Nfts found" })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
