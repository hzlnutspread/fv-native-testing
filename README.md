# Introduction

I am trying to figure this stuff out! Just a collection of notes and things I've figured out so far

-   to follow along just create an `.env` file with a `CALLER_PRIVATE_KEY=` field

# TRN notes

`https://github.com/futureversecom/trn-examples/blob/main/examples/substrate/use-futurepass/src/proxyExtrinsic.ts`

## the code block

```javascript
withChainApi("porcini", async (api, caller, logger) => {
	const fpAccount = (await api.query.futurepass.holders(caller.address)).unwrapOr(undefined);

	const call = api.tx.system.remarkWithEvent("Hello World");

    const extrinsic = api.tx.futurepass.proxyExtrinsic(fpAccount, call);

	const { result, extrinsicId } = await sendExtrinsic(extrinsic, caller, { log: logger });

```

## breaking down the code

```javascript
withChainApi("porcini", async (api, caller, logger)
```

-   Connects to the network API (getChainApi)
-   creates a keyring for the signer/caller
-   sets up a logger

<br>

```javascript
const call = api.tx.system.remarkWithEvent("Hello World")
```

-   creates the function to be called by the FP account

<br>

```javascript
const fpAccount = (await api.query.futurepass.holders(caller.address)).unwrapOr(
    undefined
)
```

-   gets the futurepass user to call the extrinsic based on the caller address

<br>

```javascript
api.tx.futurepass.proxyExtrinsic(fpAccount, call)
```

-   creates the extrinsic with the FP user, and the function as parameters

<br>

```javascript
const { result, extrinsicId } = await sendExtrinsic(extrinsic, caller)
```

-   dispatches the extrinsic from the caller

<br>
