const { deployContract, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")

const {upgrades, ethers, network} = require("hardhat")


async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Account: ", owner.address)
  const addresses = {}
  const OPEN =  await ethers.getContractFactory("OPEN")
  const contract = await upgrades.deployProxy(OPEN, ["0x5678917FfEb77827Aafc33419E99DaCd707313a9"])
  await contract.deployed();
  console.log("OPEN deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
