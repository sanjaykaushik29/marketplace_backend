import { NFTDATA } from "../Interface/nftInterface";
import { USERATA } from "../Interface/userInterface";
import { checkIsComplete } from "./parseData";

export const lazyMintValidations = (nftData: NFTDATA, user: USERATA) => {
    try {
        const { name, description, category, type, royalties, image, price, signature, token_uri, external_Url } = nftData
        const { wallet_address } = user
        let data: NFTDATA = {
            name, description, category, type, royalties, image, price, signature, token_uri, creator: wallet_address, owner: wallet_address,
        }
        // if (typeof isSell !== "boolean") return { error: "isSell must be boolean" }
        // if (data.isSell) {
        //     data = { ...data, ['saleType']: saleType }            
        //     if (data.saleType === "Auction") {
        //         data = {
        //             ...data,
        //             ['auctionStartDate']: auctionStartDate,
        //             ['auctionEndDate']: auctionEndDate,
        //             ['bidPrice']: price
        //         }
        //     }
        // }
        const { isComplete, key } = checkIsComplete(data)
        if (!isComplete) return { error: `${key} is required` }
        data = {
            ...data,
            ['nonce']: 1,
            ["isMint"]: false,
            ["mintType"]: "Lazy Mint",
            external_Url,
            isComplete,
        }
        return { data }
    } catch (error) {
        return { error: error }
    }
}
