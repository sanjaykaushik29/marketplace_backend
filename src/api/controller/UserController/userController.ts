import { Request, Response } from 'express'
import { UserRequest } from '../../../Interface/userInterface'
const User = require("../../model/User.model");
const userServices = require('../../services/user.services')
const NFT_History = require('../../model/HistoryNft.model')

exports.signup = async (req: Request, res: Response) => {
    try {
        userServices.UserSignup(req, res, (error: any, result: any) => {
            if (error) {
                return res.status(400).send({
                    status: 400,
                    message: error
                })
            }
            return res.status(200).send(
                {
                    status: 200,
                    message: "your information saved successfully!",
                    data: result,
                    success: true
                });
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error",
        })
    }
}

exports.login = async (req: UserRequest, res: Response) => {
    try {
        userServices.loginService(req, (error: any, result: any) => {
            if (error) {
                return res.status(400).send({
                    status: 400,
                    error: error
                })
            }
            return res.status(200).send(
                {
                    status: 200,
                    message: "Login Sucessfull",
                    data: result,
                    success: true
                });
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error",
            error: error
        })
    }
}

exports.checkUser = async (req: Request, res: Response) => {
    try {
        userServices.checkUserService(req, res, (error: any, result: any) => {
            if (error) {
                return res.status(400).send({
                    status: 400,
                    message: error
                })
            }
            return res.status(200).send(
                {
                    status: 200,
                    message: "success",
                    data: result,
                    success: true
                });
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error",
        })
    }
}

exports.editProfile = async (req: UserRequest, res: Response) => {
    try {
        userServices.UpdateProfile(req, (error: any, result: any) => {
            if (error) {
                return res.status(400).send({
                    status: 400,
                    error: error
                })
            }
            return res.status(200).send(
                {
                    status: 200,
                    message: "Your information has been updated!",
                    data: result,
                    success: true
                });
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error",
            error: error
        })
    }
}

exports.getUserProfileData = async (req: UserRequest, res: Response) => {
    let { walletAddress } = req.params;
    try {
        const response = await User.findOne({ wallet_address: walletAddress?.toLowerCase() });
        res.status(200).send({
            data: response,
            status: 200,
            success: true,
            message: "Your information has been retrieved",
        });
    } catch (e) {
        res.status(400).send({
            status: 400,
            success: false,
            message: "failed to fetch data",
        });
    }
};

export const getPopularCreators = async (req: Request, res: Response) => {
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
                $group: {
                    "_id": "$creator",
                    "COUNT": { "$sum": 1 }
                }
            },
            { $sort: { "COUNT": -1 } },
            { $limit: 8 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "wallet_address",
                    as: "creators",
                }
            },
            { $unwind: { path: "$creators" } },
            { $replaceRoot: { newRoot: "$creators" } },
        ])
        if (response) res.status(200).send({ data: response, message: "Top Creators fetched sucessfully" })
        else res.status(400).send({ message: "No Nfts found" })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.getUserProfileData = async (req: UserRequest, res: Response) => {
    let { walletAddress } = req.params;
    try {
        if(!walletAddress){
            return res.status(400).send({
                status: 400,
                error: "Wallet Address Required!"
            }) 
        }
        const response = await User.findOne({ wallet_address: walletAddress?.toLowerCase() });
        res.status(200).send({
            data: response,
            status: 200,
            success: true,
            message: "Your information has been retrieved",
        });
    } catch (e) {
        res.status(400).send({
            status: 400,
            success: false,
            message: "failed to fetch data",
        });
    }
};

export const createCollectionFunction = async (req: UserRequest, res: Response) => {
    try {
        console.log("auth ==> ",req.user)
        //  actionType = 5, 6, 7
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
