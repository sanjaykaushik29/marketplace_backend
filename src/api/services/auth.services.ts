
import { NextFunction, Response } from "express"
import { UserRequest } from "../../Interface/userInterface";
const User = require("../model/User.model")
var jwt = require('jsonwebtoken');

export const generateToken = (id: string) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            _id: id,
        }
        const token = jwt.sign(data, jwtSecretKey);
        return { token }
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export const auth = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const { _id } = jwt.verify(token, jwtSecretKey);
        const user = await User.findOne({ _id })
        req['user'] = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: "Unauthorized" })
    }
}
