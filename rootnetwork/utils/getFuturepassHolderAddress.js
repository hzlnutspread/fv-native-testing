import { createKeyRing } from "./createKeyring"
import { getChainApi } from "./getChainApi"

export async function getFuturepassHolders(network) {
    const api = await getChainApi(network)
    const signer = createKeyRing(process.env.CALLER_PRIVATE_KEY)

    const data = await api.query.futurepass
        .holders(signer.address)
        .then((response) => response.toJSON())
    console.log(signer.address)
    console.log(data)
}
