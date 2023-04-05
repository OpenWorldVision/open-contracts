const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function getHarmonyValues(){
  const { one, btc, usdc, eth} = tokens
  const tokenArr = [btc, one, usdc, eth]
  const fastPriceTokens = []

  const priceFeedTimelock = { address: "0x3084DECAeBf765AA916f98CF034610200b197158" }

  const updater1 = { address: "0xe6fd8f16CA620854289571FBBB7eE743437fc027" }
  // const updater2 = { address: "0x8588bBa54C5fF7209cd23068E2113e825AA4CA7F" }
  // const keeper1 = { address: "0x5405415765D1aAaC6Fe7E287967B87E5598Aab8C" }
  // const keeper2 = { address: "0x3f321C9303cAE0Cb02631e92f52190482b8Fa0A6" }
  const updaters = [updater1.address]

  const tokenManager = { address: "0x5678917FfEb77827Aafc33419E99DaCd707313a9" }

  const positionRouter = await contractAt("PositionRouter", "0xb336DF02DcdD6A433ED4F0500816F07666A4f70f")

  const fastPriceEvents = await contractAt("FastPriceEvents", "0x29Bf42dDAB3D88eb45d13fa7FaeC87532BE531b1")
  // const fastPriceEvents = await deployContract("FastPriceEvents", [])

  // const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    // chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getBscValues(){
  const { btc, bnb, busd, eth} = tokens
  const tokenArr = [btc, bnb, busd, eth]
  const fastPriceTokens = []

  const priceFeedTimelock = { address: "0x51d2E6c7B6cc67875D388aDbE2BB7A8238EA6353" }

  const updater1 = { address: "0xe6fd8f16CA620854289571FBBB7eE743437fc027" }
  // const updater2 = { address: "0x8588bBa54C5fF7209cd23068E2113e825AA4CA7F" }
  // const keeper1 = { address: "0x5405415765D1aAaC6Fe7E287967B87E5598Aab8C" }
  // const keeper2 = { address: "0x3f321C9303cAE0Cb02631e92f52190482b8Fa0A6" }
  const updaters = [updater1.address]

  const tokenManager = { address: "0x7D52Fc0564e13c8D515e1e1C17CCB7aFafAd37F3" }

  const positionRouter = await contractAt("PositionRouter", "0xf5D769Fc5A274812e81a12bD900EFCD29c6EaE78")

  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x29Bf42dDAB3D88eb45d13fa7FaeC87532BE531b1")
  const fastPriceEvents = await deployContract("FastPriceEvents", [])

  // const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    // chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getTestnetValues(){
  const { btc, bnb, busd} = tokens
  const tokenArr = [btc, bnb, busd]
  const fastPriceTokens = []

  const priceFeedTimelock = { address: "0x11Ccc78ad8D3C2FfeB42Eca65934476D31794f5F" }

  const updater1 = { address: "0x9B82B9Ab7570Ae452D9FF5411F1bE2bad08EF4c4" }
  const updater2 = { address: "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517" }
  const keeper1 = { address: "0x33EDbEc831AD335f26fFC06EB07311cC99F50084" }
  const keeper2 = { address: "0x3134d254202E5dd2d98E4ba10CaE3703199c3FB0" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x15f54d599ADF24b809de9B9C917061Ce0cB7617f" }

  const positionRouter = await contractAt("PositionRouter", "0x9B25fb7d0af7B36d9dF9b872d1e80D42F0278168")

  const fastPriceEvents = await contractAt("FastPriceEvents", "0xf71d18652C3975e75fddd07396869f1ccA184C5a")
  // const fastPriceEvents = await deployContract("FastPriceEvents", [])

  // const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    // chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getArbValues(signer) {
  const { btc, eth, usdc, link, uni, usdt, mim, frax, dai } = tokens
  const tokenArr = [btc, eth, usdc, usdt, mim, frax, dai]
  const fastPriceTokens = []

  const priceFeedTimelock = { address: "0xdD3493dEcAC2bD82391fd6fd2f3a6c983372a015" }

  const updater1 = { address: "0xe6fd8f16CA620854289571FBBB7eE743437fc027" }
  // const updater2 = { address: "0x8588bBa54C5fF7209cd23068E2113e825AA4CA7F" }
  // const keeper1 = { address: "0x5405415765D1aAaC6Fe7E287967B87E5598Aab8C" }
  // const keeper2 = { address: "0x3f321C9303cAE0Cb02631e92f52190482b8Fa0A6" }
  const updaters = [updater1.address]

  const tokenManager = { address: "arb1:0x07f3E5DA3f9AaA2ba21b0c2177CD0AE5457CDCaB" }

  const positionRouter = await contractAt("PositionRouter", "0x73979a145092a47B1437d3e8b1De89ec5c4F7F5B")

  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x4530b7DE1958270A2376be192a24175D795e1b07", signer)
  const fastPriceEvents = await deployContract("FastPriceEvents", [])

  // const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    // chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}



async function getValues(signer) {
  if (network === "arbitrum") {
    return getArbValues(signer)
  }

  if (network === "testnet") {
    return getTestnetValues()
  }

  if (network === "bsc") {
    return getBscValues()
  }

  if (network === "harmony") {
    return getHarmonyValues()
  }
}

async function main() {
  const signer = await getFrameSigner()
  const deployer = { address: "0x5678917FfEb77827Aafc33419E99DaCd707313a9" }

  const {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  } = await getValues(signer)

  const signers = [
    "0xee73ccf048bD7aEa4090F06a8bE6C5263bbFF969",
    "0x88888818a99982CB08673f0E1e377C3AF066A840",
    "0xD8df3942Ab5218beeA2F9Df3E71f56C9bac44026",
    "0xAAfcBD2D5D4281bD32cfCdb4b5D1626124878194",
    "0xd2e80D60aff5377587E49FF32c9bad639d6f68Bc",
    "0xE8f0d5BAC383a9e0A2C43D236513F62B6151bDeA",
  ]

  if (fastPriceTokens.find(t => !t.fastPricePrecision)) {
    throw new Error("Invalid price precision")
  }

  if (fastPriceTokens.find(t => !t.maxCumulativeDeltaDiff)) {
    throw new Error("Invalid price maxCumulativeDeltaDiff")
  }
  // const secondaryPriceFeed = await contractAt("FastPriceFeed", "0x8A4582a917b5B7F1bD2D043Fc9a67026087A1E05")

  const secondaryPriceFeed = await deployContract("FastPriceFeed", [
    5 * 60 * 60, // _priceDuration  10 hours
    12 * 60 * 60, // _maxPriceUpdateDelay 12 hours
    1, // _minBlockInterval
    250, // _maxDeviationBasisPoints
    fastPriceEvents.address, // _fastPriceEvents
    deployer.address, // _tokenManager
    positionRouter.address
  ])

  const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xaDFd281dd7bC9de80AC2aF5811914FF87ef6e00f")

  await sendTxn(vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)), "vaultPriceFeed.setMaxStrictPriceDeviation") // 0.01 USD
  await sendTxn(vaultPriceFeed.setPriceSampleSpace(1), "vaultPriceFeed.setPriceSampleSpace")
  await sendTxn(vaultPriceFeed.setSecondaryPriceFeed(secondaryPriceFeed.address), "vaultPriceFeed.setSecondaryPriceFeed")
  await sendTxn(vaultPriceFeed.setIsAmmEnabled(false), "vaultPriceFeed.setIsAmmEnabled")

  // if (chainlinkFlags) {
  //   await sendTxn(vaultPriceFeed.setChainlinkFlags(chainlinkFlags.address), "vaultPriceFeed.setChainlinkFlags")
  // }

  for (const [i, tokenItem] of tokenArr.entries()) {
    if (!tokenItem || tokenItem.spreadBasisPoints === undefined) { continue }
    await sendTxn(vaultPriceFeed.setSpreadBasisPoints(
      tokenItem.address, // _token
      tokenItem.spreadBasisPoints // _spreadBasisPoints
    ), `vaultPriceFeed.setSpreadBasisPoints(${tokenItem.name}) ${tokenItem.spreadBasisPoints}`)
  }

  for (const token of tokenArr) {
    await sendTxn(vaultPriceFeed.setTokenConfig(
      token.address, // _token
      token.priceFeed, // _priceFeed
      token.priceDecimals, // _priceDecimals
      token.isStrictStable // _isStrictStable
    ), `vaultPriceFeed.setTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`)
  }

  await sendTxn(secondaryPriceFeed.initialize(1, signers, updaters), "secondaryPriceFeed.initialize")
  await sendTxn(secondaryPriceFeed.setTokens(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.fastPricePrecision)), "secondaryPriceFeed.setTokens")
  await sendTxn(secondaryPriceFeed.setVaultPriceFeed(vaultPriceFeed.address), "secondaryPriceFeed.setVaultPriceFeed")
  await sendTxn(secondaryPriceFeed.setMaxTimeDeviation(60 * 60), "secondaryPriceFeed.setMaxTimeDeviation")
  await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfInactive(50), "secondaryPriceFeed.setSpreadBasisPointsIfInactive")
  await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfChainError(500), "secondaryPriceFeed.setSpreadBasisPointsIfChainError")
  await sendTxn(secondaryPriceFeed.setMaxCumulativeDeltaDiffs(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.maxCumulativeDeltaDiff)), "secondaryPriceFeed.setMaxCumulativeDeltaDiffs")


  await sendTxn(secondaryPriceFeed.setPriceDataInterval(1 * 60), "secondaryPriceFeed.setPriceDataInterval")

  await sendTxn(positionRouter.setPositionKeeper(secondaryPriceFeed.address, true), "positionRouter.setPositionKeeper(secondaryPriceFeed)")
  await sendTxn(fastPriceEvents.setIsPriceFeed(secondaryPriceFeed.address, true), "fastPriceEvents.setIsPriceFeed")

  await sendTxn(vaultPriceFeed.setGov(priceFeedTimelock.address), "vaultPriceFeed.setGov")
  await sendTxn(secondaryPriceFeed.setGov(priceFeedTimelock.address), "secondaryPriceFeed.setGov")
  await sendTxn(secondaryPriceFeed.setTokenManager(tokenManager.address), "secondaryPriceFeed.setTokenManager")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
