import Moralis from 'moralis';
import { parseNFTData } from '../../../Utils/parseData';

export const getNFTByTokenID = async (tokenId: string, contractAddress: any, chainId: any) => {
    try {
        const response: any = await Moralis.EvmApi.nft.getNFTMetadata({
            address: contractAddress || process.env.ERCTOKEN_CONTRACT_ADDRESS,
            chain: chainId,
            tokenId: tokenId,
            normalizeMetadata: true,

        })
        const data = parseNFTData(response?.jsonResponse)

        return { data }
    } catch (error) {
        console.log(error)
        return { error }
    }
}
