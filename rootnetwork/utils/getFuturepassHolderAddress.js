import { createKeyRing } from "./createKeyring"
import { getChainApi } from "./getChainApi"

export async function getFuturepassHolders(network, signer) {
    const api = await getChainApi(network)
    const callerAddress = await signer.getAddress()

    const fpAddress = await api.query.futurepass
        .holders(callerAddress)
        .then((response) => response.toJSON())
    console.log(callerAddress)
    console.log(fpAddress)
    return fpAddress
}
