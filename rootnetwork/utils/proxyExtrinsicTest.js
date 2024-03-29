import { filterExtrinsicEvents } from "./filterExtrinsicEvents"
import { formatEventData } from "./formatEventData"
import { sendExtrinsic } from "./sendExtrinsic"
import { withChainApi } from "./withChainApi"
import assert from "node:assert"

withChainApi("porcini", async (api, caller, logger) => {
    const fpAccount = (
        await api.query.futurepass.holders(caller.address)
    ).unwrapOr(undefined)
    assert(fpAccount)
    logger.info(
        {
            futurepass: {
                holder: caller.address,
                account: fpAccount.toString(),
            },
        },
        "futurepass details"
    )

    const call = api.tx.system.remarkWithEvent("Hello World")

    logger.info(
        {
            parameters: {
                fpAccount,
                call,
            },
        },
        `create a "futurepass.proxyExtrinsic" extrinsic`
    )
    const extrinsic = api.tx.futurepass.proxyExtrinsic(fpAccount, call)

    logger.info(`dispatch extrinsic from caller="${caller.address}"`)
    const { result, extrinsicId } = await sendExtrinsic(extrinsic, caller, {
        log: logger,
    })
    const [proxyEvent, remarkEvent] = filterExtrinsicEvents(result.events, [
        "Futurepass.ProxyExecuted",
        // depending on what extrinsic call you have, filter out the right event here
        "System.Remarked",
    ])

    logger.info(
        {
            result: {
                extrinsicId,
                blockNumber: result.blockNumber,
                proxyEvent: formatEventData(proxyEvent.event),
                remarkEvent: formatEventData(remarkEvent.event),
            },
        },
        "receive result"
    )
})
