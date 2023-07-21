import { MORALISNFTDATA, NFTMETADATA } from "../Interface/nftInterface"

export const checkIsComplete = (data: Object) => {
    for (let key in data) {
        if (data[key as keyof typeof data] === undefined) return { isComplete: false, key }
    }
    return { isComplete: true }
}

export const parseNFTData = (nftData: MORALISNFTDATA) => {
    const metaData: NFTMETADATA = JSON.parse(nftData?.metadata)

    const data = {
        name: metaData?.name,
        description: metaData?.description,
        tokenId: nftData?.token_id,
        category: metaData?.category,
        type: metaData?.nftType,
        royalties: "",
        image: metaData?.image,
        price: nftData?.amount,
        creator: nftData?.minter_address?.toLowerCase(),
        owner: nftData?.owner_of?.toLowerCase(),
        external_Url: "",
        token_address: nftData?.token_address,
        token_hash: nftData?.token_hash,
        token_uri: nftData?.token_uri
    }
    const { isComplete } = checkIsComplete(data)
    return { ...data, ["isComplete"]: isComplete }
}