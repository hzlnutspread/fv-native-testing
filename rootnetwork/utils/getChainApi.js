import { ApiPromise } from "@polkadot/api"
import { getApiOptions, getPublicProvider } from "@therootnetwork/api"

const getChainApi = async (name) => {
    const api = await ApiPromise.create({
        ...getApiOptions(),
        ...getPublicProvider(name),
    })

    return api
}

export { getChainApi, ApiPromise }
