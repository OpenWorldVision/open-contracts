const { deployContract, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")

const {upgrades, ethers, network} = require("hardhat")


async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Account: ", owner.address)
  const OPEN =  await ethers.getContractFactory("OPEN")
  const OPENAddress = "0x58cb98a966f62aa6f2190eb3aa03132a0c3de3d5"
  const contract = await upgrades.upgradeProxy(OPENAddress, OPEN)
  // await contract.deployed();
  console.log("OPEN upgraded");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
