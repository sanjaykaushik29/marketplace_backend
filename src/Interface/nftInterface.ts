

type CATEGORY = "Digital Art" | "Music" | "Domin Name" | "Sports" | "Utilities" | "All NFT's"
type NFTTYPE = "image" | "video" | "audio"

export interface NFTMETADATA {
    name: string,
    description: string,
    nftType: NFTTYPE,
    category: CATEGORY,
    amount: string | number,
    image: string
}

export interface MORALISNFTDATA {
    amount: string
    block_number: string
    block_number_minted: string
    contract_type: string
    last_metadata_sync: string
    last_token_uri_sync: string
    metadata: string
    minter_address: string
    name: string
    owner_of: string
    possible_spam: boolean
    symbol: string
    token_address: string
    token_hash: string
    token_id: string
    token_uri: string
    transfer_index: number[]
}

export interface NFTDATA {
    name?: string,
    description?: string,
    tokenId?: string,
    category?: "Digital Art" | "Music" | "Domain Name" | "Sports" | "Utilities" | ""
    type?: "image" | "video" | "audio"
    royalties?: Number,
    image?: string,
    price?: string,
    isMint?: boolean
    mintType?: "Mint" | "Lazy Mint"
    isSell?: boolean
    saleType?: "Fixed" | "Auction"
    auctionStartDate?: string
    auctionEndDate?: string
    bidPrice?: string
    creator?: string
    signature?: string
    owner?: string
    external_Url?: string
    token_address?: string
    token_hash?: string
    token_uri?: string
    isComplete?: boolean
    nonce?:number
}
