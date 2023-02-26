const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main() {
  // await deployContract("EsOPEN", [])
  // const olp = await deployContract("OAP", []);
  // await deployContract("MintableBaseToken", ["esGMX IOU", "esGMX:IOU", 0])
  // writeTmpAddresses({ OAP: olp.address });
  const vault = await contractAt("Timelock", "0x3084DECAeBf765AA916f98CF034610200b197158")

  const min = await vault.setIsSwapEnabled(false)
  console.log(min)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
