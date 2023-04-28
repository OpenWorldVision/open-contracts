const { contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0xec45801399EB38B75A3bf793051b00bb64fF3eF8")
  const timelock = await contractAt("Timelock", "0xdD3493dEcAC2bD82391fd6fd2f3a6c983372a015")

  const { btc, eth, usdt, usdc, arb} = tokens
  const tokenArr = [arb]

  for (const token of tokenArr) {
    console.log("----------------")
    console.log(vault.address,
      token.address, // _token
      token.decimals, // _tokenDecimals
      token.tokenWeight, // _tokenWeight
      token.minProfitBps, // _minProfitBps
      expandDecimals(token.maxUsdgAmount, 18), // _maxUsdoAmount
      token.isStable, // _isStable
      token.isShortable // _isShortable
      )
    await sendTxn(vault.setTokenConfig(
      // vault.address,
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
