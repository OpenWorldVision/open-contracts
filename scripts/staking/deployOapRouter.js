const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main(){

  const pancakeRouter ="0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
  const rewardRouterV2="0xAEe7bA6bbE73f9D376109e89da53A8D08f96C168"

  const oapRouter = await deployContract("OapRouter", [pancakeRouter, rewardRouterV2])
}
main()
