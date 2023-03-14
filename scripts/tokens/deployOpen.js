const { deployContract, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")

const {upgrades, ethers} = require("hardhat")


async function main() {
  const addresses = {}
  const OPEN =  await ethers.getContractFactory("OPEN")
  const contract = await upgrades.deployProxy(OPEN, ["0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517"])
  await contract.deployed();
  console.log("OPEN deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
