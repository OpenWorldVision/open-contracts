const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function getArbValues() {
  const tokenManager = { address: "0x07f3E5DA3f9AaA2ba21b0c2177CD0AE5457CDCaB" }

  return { tokenManager }
}

async function getAvaxValues() {
  const tokenManager = { address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2" }

  return { tokenManager }
}

async function getTestnetValues() {
  const tokenManager = { address: "0x15f54d599ADF24b809de9B9C917061Ce0cB7617f" }

  return { tokenManager }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "testnet") {
    return getTestnetValues()
  }
}

async function main() {

  const admin = "0x07f3E5DA3f9AaA2ba21b0c2177CD0AE5457CDCaB"
  const buffer = network === "testnet" ? 60 : 24 * 60 * 60

  const { tokenManager } = await getValues()

  const timelock = await deployContract("PriceFeedTimelock", [
    admin,
    buffer,
    tokenManager.address
  ], "Timelock")

  const deployedTimelock = await contractAt("PriceFeedTimelock", timelock.address)

  const signers = [
    "0x5678917FfEb77827Aafc33419E99DaCd707313a9", // deployer
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await sendTxn(deployedTimelock.setContractHandler(signer, true), `deployedTimelock.setContractHandler(${signer})`)
  }

  const keepers = [
    "0x5678917FfEb77827Aafc33419E99DaCd707313a9", // deployer
    "0xe6fd8f16CA620854289571FBBB7eE743437fc027"
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
