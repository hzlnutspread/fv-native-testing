import { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import { ethers } from "ethers"
const inter = Inter({ subsets: ["latin"] })
import { ApiPromise } from "@polkadot/api"

import { withChainApi } from "../../rootnetwork/utils/withChainApi"
import { sendExtrinsic } from "../../rootnetwork/utils/sendExtrinsic"
import { formatEventData } from "../../rootnetwork/utils/formatEventData"
import { filterExtrinsicEvents } from "../../rootnetwork/utils/filterExtrinsicEvents"
import { getFuturepassHolders } from "../../rootnetwork/utils/getFuturepassHolderAddress"
import { getApiOptions, getPublicProvider } from "@therootnetwork/api"

export default function Home() {
    const [errorMessage, setErrorMessage] = useState("")
    const [showSwitchNetworkButton, setShowSwitchNetworkButton] =
        useState(false)

    const [api, setApi] = useState()
    const [provider, setProvider] = useState({})
    const [fpAddress, setFpAddress] = useState()
    const [loading, setLoading] = useState(true)
    const [balance, setBalance] = useState(null)
    const [signer, setSigner] = useState(null)
    const [blockNumber, setBlockNumber] = useState(null)
    const [walletAddress, setWalletAddress] = useState("")

    const setup = async () => {
        const api = await ApiPromise.create({
            ...getApiOptions(),
            ...getPublicProvider("porcini", true),
        })
        setApi(api)
        window.ethereum.on("chainChanged", handleChainChanged)
    }

    const handleChainChanged = async () => {
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
        })
        console.log(`Network chain id : ${chainId}`)

        setShowSwitchNetworkButton(chainId !== "0x1df8")
    }

    const handleSwitchNetworkClick = async () => {
        console.log("switching to porcini...")
        if (window.ethereum) {
            console.log("detected metamask")
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId: "0x1df8",
                        },
                    ],
                })
            } catch (error) {
                console.log("error switching to porcini...")
            }
        } else {
            console.log("already connected to porcini...")
        }
    }

    const checkIfConnected = async () => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            setWalletAddress(window.ethereum.selectedAddress)
        }
    }

    useEffect(() => {
        setup()
        if (window.ethereum) {
            handleChainChanged()
        }
    }, [])

    useEffect(() => {
        checkIfConnected()
    }, [])

    useEffect(() => {
        if (!api) return
        ;(async () => {
            const time = await api.query.timestamp.now()
            console.log(time.toPrimitive())
        })()
    }, [api])

    useEffect(() => {
        setProvider(new ethers.providers.Web3Provider(window.ethereum))
    }, [])

    const handleConnectWalletButton = async () => {
        console.log("connecting wallet")
        if (typeof window.ethereum !== "undefined") {
            await requestAccount()
        }
        console.log("successfully connected wallet")
    }

    const requestAccount = async () => {
        console.log("connect wallet button clicked...")

        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        console.log(`current chain ID: ${chainId}`)

        if (window.ethereum) {
            console.log("detected metamask")
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                })

                const wallet = accounts[0]
                setWalletAddress(wallet)

                const balance = await getAccountBalance(wallet)
                setBalance(balance)

                const signer = await getSigner(provider)
                setSigner(signer)
            } catch (error) {
                console.log("error connecting...")
            }
        } else {
            console.log("metamask not detected")
        }
    }

    const getAccountBalance = async (wallet) => {
        setLoading(true)
        const balance = await provider.getBalance(wallet)
        setLoading(false)
        return ethers.utils.formatEther(balance)
    }

    const getSigner = async (provider) => {
        const signer = await provider.getSigner()
        return signer
    }

    const handleSendExtrinsicButtonClick = async () => {
        const callerAddress = await signer.getAddress()

        await withChainApi("porcini", async (api) => {
            const fpAccount = (
                await api.query.futurepass.holders(callerAddress)
            ).unwrapOr(undefined)
            if (!fpAccount) {
                setErrorMessage(
                    `FuturePass account for address ${callerAddress} does not exist.\nPlease create a FuturePass to continue`
                )
                throw new Error(
                    `FuturePass account for address ${callerAddress} does not exist. Please create a FuturePass to continue`
                )
            }

            console.log(callerAddress)
            console.log(fpAccount.toString())

            // const call = api.tx.system.remarkWithEvent("Hello World")

            // console.log(`fpAccount = ${fpAccount}`)
            // console.log(`call = ${call}`)

            // const extrinsic = api.tx.futurepass.proxyExtrinsic(fpAccount, call)

            // console.log(`dispatch extrinsic from caller="${callerAddress}"`)

            // const { result, extrinsicId } = await sendExtrinsic(
            //     extrinsic,
            //     signer,
            //     {}
            // )
            // const [proxyEvent, remarkEvent] = filterExtrinsicEvents(
            //     result.events,
            //     ["Futurepass.ProxyExecuted", "System.Remarked"]
            // )

            // console.log(extrinsicId)
            // console.log(result.blockNumber)
            // console.log(formatEventData(proxyEvent.event))
            // console.log(formatEventData(remarkEvent.event))
        })
    }

    const handleGetFuturepassAddressButtonClick = async () => {
        const fpAddress = await getFuturepassHolders("porcini", signer)
        if (!fpAddress) {
            setErrorMessage(
                `FuturePass account does not exist.\nPlease create a FuturePass to continue`
            )
        } else {
            setFpAddress(fpAddress)
        }
    }

    return (
        <main className={`min-h-screen p-24 ${inter.className}`}>
            <div className="text-[#FFFFFF] text-[24px]">testing extrinsics</div>
            {showSwitchNetworkButton ? (
                <>
                    <div className="mt-2">
                        you are not connected to porcini, please click here to
                        switch chains
                    </div>
                    <button
                        className=" bg-[#FFFFFF] mt-2 p-2 rounded-lg text-[#151515]"
                        onClick={handleSwitchNetworkClick}
                    >
                        porcini
                    </button>
                </>
            ) : (
                <div>
                    <div>
                        {walletAddress.length === 0 ? (
                            <button
                                onClick={handleConnectWalletButton}
                                className=" bg-[#FFFFFF] mt-4 p-2 rounded-lg text-[#151515]"
                            >
                                connect wallet
                            </button>
                        ) : (
                            <button className=" bg-[#FFFFFF] mt-4 p-2 rounded-lg text-[#151515]">
                                connected!
                            </button>
                        )}
                        <div className="pt-2">
                            connected address:{" "}
                            {walletAddress ? walletAddress : "not connected"}
                        </div>
                        <div>
                            account xrp balance:{" "}
                            {balance ? balance : "not connected"}
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleGetFuturepassAddressButtonClick}
                            className=" bg-[#FFFFFF] mt-4 p-2 rounded-lg text-[#151515]"
                        >
                            get holder futurepass address
                        </button>
                    </div>
                    <div className="pt-2">
                        futurepass address:{" "}
                        {fpAddress ? fpAddress : "press button to retrieve"}
                    </div>
                    <div>
                        <button
                            onClick={handleSendExtrinsicButtonClick}
                            className=" bg-[#FFFFFF] mt-8 p-2 rounded-lg text-[#151515]"
                        >
                            remark with event extrinsic
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 mt-2">{errorMessage}</div>
                    )}
                </div>
            )}
        </main>
    )
}
