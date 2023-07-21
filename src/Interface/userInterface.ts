import { Request } from "express"

export interface USERATA {
    firstName?: string
    lastName?: string
    nickname?: string,
    email?: string,
    bio?: string,
    wallet_address?: string
    links?: string,
    coverImage?: string
    profileImage?: string
    _id?: string
}

export interface UserRequest extends Request {
    user: USERATA;
    file?: any;
    files?: any;
}
