import { Request, Response } from "express";
import { generateToken } from "./auth.services";
import { USERATA, UserRequest } from "../../Interface/userInterface";

const UserDB = require('../model/User.model');


async function UserSignup(req: UserRequest, res: Response, callback: any) {
    try {
        let walletAddress = req.body.wallet_address?.toLowerCase();
        if (walletAddress === undefined) {
            return callback({ message: "walletAddress required" })
        }
        req.body.wallet_address = walletAddress
        const wallet = await UserDB.findOne({ wallet_address: walletAddress })
        if (wallet) {
            return callback({ wallet_address: 'walletAddress already exist' });
        } else {
            if (req?.files?.length) {
                req.body.coverImage = req?.files?.coverImage[0]?.location
                req.body.profileImage = req?.files?.profileImage[0]?.location
            }
            const user = new UserDB(req.body)
            user.save().then((response: any) => {
                const { token, error } = generateToken(response._id)
                if (error) return callback(error)
                return callback(null, { response, token })
            }).catch((error: any) => {
                return callback(error);
            });
        }
    }
    catch (error) {
        res.status(500).send({
            status: 500,
            message: error,
        })
    }

}

async function loginService(req: Request, callback: any) {
    try {
        let { wallet_address } = req.body;
        if (!wallet_address) return callback({ message: "Please send a Wallet Address" })
        else {
            const response = await UserDB.findOne({ wallet_address: wallet_address.toLowerCase() })
            if (response) {
                const { token, error } = generateToken(response._id)
                if (token) return callback(null, { token });
                else return callback(error);
            }
            else return callback({ wallet_address: 'WalletAddress does not exist' });
        }
    }
    catch (error) {
        return callback(error);
    }

}

async function checkUserService(req: Request, res: Response, callback: any) {
    try {
        let { walletAddress } = req.params;
        if (walletAddress === undefined) {
            return callback({ message: "walletAddress required" })
        }
        if (walletAddress) {
            const response = await UserDB.findOne({ wallet_address: walletAddress.toLowerCase() })
            if (response) return callback(null, { wallet_address: 'Wallet Address exist' });
            else return callback({ wallet_address: 'Wallet Address does not exist' });
        }
    }
    catch (e) {
        res.status(500).send({
            status: 500,
            message: "server error",
        })
    }

}

async function UpdateProfile(req: UserRequest, callback: (error: any, result: any) => null) {
    try {
        const id = req.params.userId;
        let updateUserData: USERATA = req.body
        if (req?.files?.coverImage?.length) updateUserData = { ...updateUserData, ["coverImage"]: req?.files?.coverImage[0]?.location }
        if (req?.files?.profileImage?.length) updateUserData = { ...updateUserData, ["profileImage"]: req?.files?.profileImage[0]?.location }
        const response = await UserDB.findOneAndUpdate({ _id: id }, updateUserData, { new: true });
        return callback(null, response);
    }
    catch (error: any) {
        console.log("err", error);
        callback(error, null);
    }
}

module.exports = {
    loginService,
    checkUserService,
    UserSignup,
    UpdateProfile,
}