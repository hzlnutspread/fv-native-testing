import {
    AddressOrPair,
    SignerOptions,
    SubmittableExtrinsic,
    SubmittableResultValue,
} from "@polkadot/api/types"
import { withChainApi } from "./withChainApi"
import { ISubmittableResult } from "@polkadot/types/types"

export async function sendExtrinsic(extrinsic, signer, options = {}) {
    return new Promise((resolve, reject) => {
        let unsubscribe
        const { log, ...signerOptions } = options

        extrinsic.signAndSend(signer, signerOptions, (result) => {
            const { status, dispatchError, txHash, txIndex, blockNumber } =
                result
            log?.info(`extrinsic status="${status.type}`)
            if (!status.isFinalized) return
            if (!txIndex || !blockNumber) return
            if (!dispatchError) {
                unsubscribe?.()
                const blockHash = status.asFinalized.toString()
                const height = blockNumber.toString().padStart(10, "0")
                const index = txIndex.toString().padStart(6, "0")
                const hash = blockHash.slice(2, 7)
                const extrinsicId = `${height}-${index}-${hash}`
                return resolve({
                    blockHash,
                    extrinsicHash: txHash.toString(),
                    extrinsicIndex: txIndex,
                    extrinsicId,
                    result,
                })
            }
        })
    })
}
