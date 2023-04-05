const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main(){

  const pancakeRouter ="0xd99d1c33f9fc3444f8101754abc46c52416550d1"
  const rewardRouterV2="0x26E8F916643fbfF603f2DD7348bA50b63A11b6b7"
  const weth = "0x612777Eea37a44F7a95E3B101C39e1E2695fa6C2"

  const oapRouter = await deployContract("OapRouter", [pancakeRouter, rewardRouterV2, weth])
}
main()
