import { useState } from "react"
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })
import { filterExtrinsicEvents } from "../../rootnetwork/utils/filterExtrinsicEvents"
import { formatEventData } from "../../rootnetwork/utils/formatEventData"
import { sendExtrinsic } from "../../rootnetwork/utils/sendExtrinsic"
import { withChainApi } from "../../rootnetwork/utils/withChainApi"
import { getFuturepassHolders } from "../../rootnetwork/utils/getFuturepassHolderAddress"

export default function Home() {
    const [errorMessage, setErrorMessage] = useState("")

    const handleSendExtrinsicButtonClick = async () => {
        await withChainApi("porcini", async (api, caller) => {
            const fpAccount = (
                await api.query.futurepass.holders(caller.address)
            ).unwrapOr(undefined)
            if (!fpAccount) {
                setErrorMessage(
                    `FuturePass account for address ${caller.address} does not exist.\nPlease create a FuturePass to continue`
                )
                throw new Error(
                    `FuturePass account for address ${caller.address} does not exist. Please create a FuturePass to continue`
                )
            }

            console.log(caller.address)
            console.log(fpAccount.toString())

            const call = api.tx.system.remarkWithEvent("Hello World")

            console.log(`fpAccount = ${fpAccount}`)
            console.log(`call = ${call}`)

            const extrinsic = api.tx.futurepass.proxyExtrinsic(fpAccount, call)

            console.log(`dispatch extrinsic from caller="${caller.address}"`)

            const { result, extrinsicId } = await sendExtrinsic(
                extrinsic,
                caller,
                {}
            )
            const [proxyEvent, remarkEvent] = filterExtrinsicEvents(
                result.events,
                [
                    "Futurepass.ProxyExecuted",
                    // depending on what extrinsic call you have, filter out the right event here
                    "System.Remarked",
                ]
            )

            console.log(extrinsicId)
            console.log(result.blockNumber)
            console.log(formatEventData(proxyEvent.event))
            console.log(formatEventData(remarkEvent.event))
        })
    }

    const handleGetFuturepassAddressButtonClick = async () => {
        await getFuturepassHolders("porcini")
    }

    return (
        <main className={`min-h-screen p-24 ${inter.className}`}>
            <div className="text-[#FFFFFF] text-[24px]">helloooo mate</div>
            <div>
                <button
                    onClick={handleSendExtrinsicButtonClick}
                    className=" bg-[#FFFFFF] mt-4 p-2 rounded-lg text-[#151515]"
                >
                    send extrinsic
                </button>
            </div>
            <div>
                <button
                    onClick={handleGetFuturepassAddressButtonClick}
                    className=" bg-[#FFFFFF] mt-4 p-2 rounded-lg text-[#151515]"
                >
                    get futurepass holders
                </button>
            </div>
            {errorMessage && (
                <div className="text-red-500 mt-4">{errorMessage}</div>
            )}
        </main>
    )
}
