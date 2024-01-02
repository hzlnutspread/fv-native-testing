import { Keyring } from "@polkadot/api"
import { hexToU8a } from "@polkadot/util"

export function createKeyRing(seed) {
    const keyring = new Keyring({ type: "ethereum" })
    const seedU8a = hexToU8a(seed)
    return keyring.addFromSeed(seedU8a)
}
