const { contractAt , sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const referralStorage = await contractAt("ReferralStorage", "0xe6fab3F0c7199b0d34d7FbE83394fc0e0D06e99d")

  return { referralStorage }
}

async function getAvaxValues() {
  const referralStorage = await contractAt("ReferralStorage", "0x827ED045002eCdAbEb6e2b0d1604cf5fC3d322F8")

  return { referralStorage }
}

async function getTestnetValues() {
  const referralStorage = await contractAt("ReferralStorage", "0xcFB491149F0a037EfcF5A0323cc460C8a83635Fa")

  return { referralStorage }
}

async function getBscValues() {
  const timelock = await contractAt("Timelock", "0x51d2e6c7b6cc67875d388adbe2bb7a8238ea6353")
  const referralStorage = await contractAt("ReferralStorage", "0xB393A3d6456305628339461264e7EFbABB38086d")
  return { referralStorage, timelock }
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

  if (network === "bsc"){
    return getBscValues()
  }
}

async function main() {
  const { referralStorage } = await getValues()

  if (network === "bsc") {
    const { timelock } = await getValues()
    await sendTxn(timelock.setTier(referralStorage.address, 0, 1000, 5000), "referralStorage.setTier 0")
    await sendTxn(timelock.setTier(referralStorage.address, 1, 2000, 5000), "referralStorage.setTier 1")
    await sendTxn(timelock.setTier(referralStorage.address, 2, 2500, 4000), "referralStorage.setTier 2")
    return
  }

  await sendTxn(referralStorage.setTier(0, 1000, 5000), "referralStorage.setTier 0")
  await sendTxn(referralStorage.setTier(1, 2000, 5000), "referralStorage.setTier 1")
  await sendTxn(referralStorage.setTier(2, 2500, 4000), "referralStorage.setTier 2")

  // await sendTxn(referralStorage.setReferrerTier("0x6b731F981e61db67A875aF0742D6d9d933634e56", 1), "referralStorage.setReferrerTier 1")
  // await sendTxn(referralStorage.setReferrerTier("0xEAb042614200C538c796A7b48D5e42929cDe3Fb4", 1), "referralStorage.setReferrerTier 2")
  // await sendTxn(referralStorage.setReferrerTier("0x2eE5Aaae7be7BD69bDD39103Ce85C7F0376aAB72", 1), "referralStorage.setReferrerTier 2")

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
