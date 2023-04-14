const { getFrameSigner, deployContract, contractAt, sendTxn, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function main() {
  let tokenAddress
  if (network === "bsc") {
    tokenAddress = "0x27a339d9b59b21390d7209b78a839868e319301b"
  }
  if (network === "arbitrum") {
    tokenAddress = "0x58CB98A966F62aA6F2190eB3AA03132A0c3de3D5"
  }

  console.log("Token Address: ", tokenAddress)
  const openStaking = await deployContract("OpenStaking", [
    tokenAddress
  ])
  await openStaking.addOperator("0x07f3E5DA3f9AaA2ba21b0c2177CD0AE5457CDCaB") // multisig wallet
  // const openToken = await contractAt("ERC20","0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b")
  // await openToken.approve(openStaking.address, "1000000000000000000000000")
  // await openStaking.submit("0x7C3C9d9E9251112f3c0E54DAe07921A0c699A3E7", "1000000000000000000000")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
