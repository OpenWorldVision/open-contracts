const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../core/tokens")[network];
const { AddressZero } = ethers.constants

function getValues() {
  if (network === "bsc") {
    return {
      glpManagerAddress: {
        address: "0x7fc55B3C5f15f1B9664170DF18C57e13bB1B7D39"
      },
      glpAddress : {
        address: "0x150bb59460E35084ab847629Cf3EcDC543e5Bf97"
      },
      esGmx: {
        address: "0x49B30A264Cf99F121fdbd524b6D150525FB97f6A"
      },
      stakedGlpTracker: {
        address: ""
      }
    }
  }

  if (network === "testnet") {
    return {
      glpManagerAddress: {
        address: "0x5b7a04b9f5f88f215920fdcc704084349530dcc7"
      },
      glpAddress : {
        address: "0xC6012955CEF9137FE9B1C01361c41FBf7E8dFfD9"
      },
      esGmx: {
        address: "0x8a4271871980a31a3ee87e3727057e68b43dcc59"
      },
      stakedGlpTracker: {
        address: "0xb71493222f5899407e01b840a428c33b9c03211d"
      },
    }
  }

  if (network === "harmony") {
    return {
      glpManagerAddress: {
        address: "0x946d6672cB1E344C89B754b422b3A5eB5C1e26Ad"
      },
      glpAddress : {
        address: "0x93746Ae82a533A986F287f3a54E3c2f83da43661"
      },
      esGmx: {
        address: "0xF858Fd0d583Fa55818E72c447EBee221C13bbf51"
      },
      stakedGlpTracker: {
        address: "0xb71493222f5899407e01b840a428c33b9c03211d"
      },
    }
  }
}

async function main() {
  const { nativeToken } = tokens;

  const vestingDuration = 365 * 24 * 60 * 60;
  const { glpAddress, glpManagerAddress, stakedGlpTracker: stakedGlpTrackerAddr, esGmx } = getValues()
  const glpManager = await contractAt(
    "GlpManager",
    glpManagerAddress.address
  );
  const glp = await contractAt(
    "OAP",
    glpAddress.address
  );

  await sendTxn(
    glp.setInPrivateTransferMode(true),
    "glp.setInPrivateTransferMode"
  );
  // FIXME: Run in BSC, Harmony
  const feeGlpTracker = await deployContract("RewardTracker", [
    "Fee OAP",
    "fOAP",
  ]);
  // FIXME: Run in BSC Testnet
  // const feeGlpTracker = await contractAt("RewardTracker", "0x5e1e7da3a3ed2c77b9b8b70a2fb63df980806dc8")
  const feeGlpDistributor = await deployContract("RewardDistributor", [
    nativeToken.address,
    feeGlpTracker.address,
  ]);

  // const feeGlpDistributor = await contractAt("RewardDistributor", "0xeccafb5a6250ab005c25b8fdfc7390c087dc2556 ")

  // FIXME: Run in BSC, Harmony
  await sendTxn(
    feeGlpTracker.initialize([glp.address], feeGlpDistributor.address),
    "feeGlpTracker.initialize"
  );
  await sendTxn(
    feeGlpDistributor.updateLastDistributionTime(),
    "feeGlpDistributor.updateLastDistributionTime"
  );

  // FIXME: Run in BSC Testnet
  // const stakedGlpTracker = await contractAt("RewardTracker", "0x6d9a7b767354cc8c1f658b1b1b547af218eb3c57")

  // FIXME: Run in BSC, Harmony
  const stakedGlpTracker = await deployContract("RewardTracker", [
    "Fee + Staked OAP",
    "fsOAP",
  ]);

  // const stakedGlpDistributor = await contractAt("RewardDistributor", "0xa35b7de62a164cf02fe93a6a080c448252b227e9")
  const stakedGlpDistributor = await deployContract("RewardDistributor", [
    esGmx.address,
    stakedGlpTracker.address,
  ]);

  const rewardRouter = await deployContract("RewardRouterV2", [])
  await sendTxn(rewardRouter.initialize(
    nativeToken.address, // _weth
    AddressZero, // _gmx
    AddressZero, // _esGmx
    AddressZero, // _bnGmx
    glp.address, // _glp
    AddressZero, // _stakedGmxTracker
    AddressZero, // _bonusGmxTracker
    AddressZero, // _feeGmxTracker
    feeGlpTracker.address, // _feeGlpTracker
    stakedGlpTracker.address, // _stakedGlpTracker
    glpManager.address, // _glpManager
    AddressZero, // _gmxVester
    AddressZero // glpVester
  ), "rewardRouter.initialize")
  // FIXME: Run in BSC, Harmony
  await sendTxn(
    stakedGlpTracker.initialize(
      [feeGlpTracker.address],
      stakedGlpDistributor.address
    ),
    "stakedGlpTracker.initialize"
  );
  await sendTxn(
    stakedGlpDistributor.updateLastDistributionTime(),
    "stakedGlpDistributor.updateLastDistributionTime"
  );

  await sendTxn(
    feeGlpTracker.setInPrivateTransferMode(true),
    "feeGlpTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    feeGlpTracker.setInPrivateStakingMode(true),
    "feeGlpTracker.setInPrivateStakingMode"
  );
  await sendTxn(
    stakedGlpTracker.setInPrivateTransferMode(true),
    "stakedGlpTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    stakedGlpTracker.setInPrivateStakingMode(true),
    "stakedGlpTracker.setInPrivateStakingMode"
  );

  await sendTxn(
    glpManager.setHandler(rewardRouter.address, true),
    "glpManager.setHandler(rewardRouter)"
  );

  // allow stakedGlpTracker to stake feeGlpTracker
  await sendTxn(
    feeGlpTracker.setHandler(stakedGlpTracker.address, true),
    "feeGlpTracker.setHandler(stakedGlpTracker)"
  );
  // // allow feeGlpTracker to stake glp
  await sendTxn(
    glp.setHandler(feeGlpTracker.address, true),
    "glp.setHandler(feeGlpTracker)"
  );

  // allow rewardRouter to stake in feeGlpTracker
  await sendTxn(
    feeGlpTracker.setHandler(rewardRouter.address, true),
    "feeGlpTracker.setHandler(rewardRouter)"
  );
  // allow rewardRouter to stake in stakedGlpTracker
  await sendTxn(
    stakedGlpTracker.setHandler(rewardRouter.address, true),
    "stakedGlpTracker.setHandler(rewardRouter)"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
