const { contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0x94ac069FA3672fe67b7A6e3f39EA47489864EFa4")
  const timelock = await contractAt("Timelock", "0x3084DECAeBf765AA916f98CF034610200b197158")

  const { one, btc, usdc, eth } = tokens
  const tokenArr = [ btc, usdc]

  for (const token of tokenArr) {
    await sendTxn(timelock.vaultSetTokenConfig(
      vault.address,
      token.address, // _token
      token.decimals, // _tokenDecimals
      token.tokenWeight, // _tokenWeight
      token.minProfitBps, // _minProfitBps
      expandDecimals(token.maxUsdgAmount, 18), // _maxUsdoAmount
      token.isStable, // _isStable
      token.isShortable // _isShortable
    ), `vault.setTokenConfig(${token.name}) ${token.address}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
