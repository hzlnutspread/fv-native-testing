import { createKeyRing } from "./createKeyring"
import { getChainApi } from "./getChainApi"
import PrettyError from "pretty-error"
import "dotenv/config"

const pe = new PrettyError()

export async function withChainApi(network, callback) {
    const [api, signer] = await Promise.all([
        getChainApi(network),
        createKeyRing(process.env.CALLER_PRIVATE_KEY),
    ])

    console.log(`create an ApiPromise instance with network="${network}"`)
    console.log(
        `create a Signer instance from a private key of address="${signer.address}"`
    )

    await callback(api, signer).catch((error) => console.log(pe.render(error)))
    await api.disconnect()

    console.log("Call ended!")
}
