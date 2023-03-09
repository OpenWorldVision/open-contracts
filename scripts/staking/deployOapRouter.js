const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main(){

  const pancakeRouter ="0xd99d1c33f9fc3444f8101754abc46c52416550d1"
  const rewardRouterV2="0x26E8F916643fbfF603f2DD7348bA50b63A11b6b7"
  const weth = "0xae13d989dac2f0debff460ac112a837c89baa7cd"

  const oapRouter = await deployContract("OapRouter", [pancakeRouter, rewardRouterV2, weth])
}
main()
