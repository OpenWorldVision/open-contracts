const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main(){

  const pancakeRouter ="0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
  const rewardRouterV2="0xAEe7bA6bbE73f9D376109e89da53A8D08f96C168"
  const weth = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"

  const oapRouter = await deployContract("OapRouter", [pancakeRouter, rewardRouterV2, weth])
}
main()
