import { getChainApi } from "./getChainApi"
import PrettyError from "pretty-error"
import "dotenv/config"

const pe = new PrettyError()

export async function withChainApi(network, callback) {
    const [api] = await Promise.all([getChainApi(network)])

    console.log(`create an ApiPromise instance with network="${network}"`)

    await callback(api).catch((error) => console.log(pe.render(error)))
    await api.disconnect()

    console.log("Call ended!")
}
