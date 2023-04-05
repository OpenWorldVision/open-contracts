const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function getHarmonyValues(signer) {
  const vault = await contractAt(
    "Vault",
    "0x94ac069FA3672fe67b7A6e3f39EA47489864EFa4"
  );

  const timelock = await contractAt(
    "Timelock",
    "0x3084DECAeBf765AA916f98CF034610200b197158"
  );
  const router = await contractAt("Router", await vault.router());
  const weth = await contractAt("WETH", tokens.nativeToken.address);

  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x066836a277FF4d9f8f4F01DC6cCe3Fc6f43e18f7"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x072f46dA9568a7088838e23653d27542356b20d6"
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "300000000000000000"; // 0.3 ONE
  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee,
  };
}

async function getBscValues(signer) {
  const vault = await contractAt(
    "Vault",
    "0x547a29352421e7273eA18Acce5fb8aa308290523"
  );

  const timelock = await contractAt(
    "Timelock",
    "0x51d2E6c7B6cc67875D388aDbE2BB7A8238EA6353"
  );
  const router = await contractAt("Router", await vault.router());
  const weth = await contractAt("WETH", tokens.nativeToken.address);

  const referralStorage = await contractAt(
    "ReferralStorage",
    "0xB393A3d6456305628339461264e7EFbABB38086d"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xc8982ffB4d5d3BA9265F550b690F9Cf015ca8eE8"
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "4000000000000000"; // 0.004 BNB
  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee,
  };
}

async function getTestnetValues(signer) {
  const vault = await contractAt(
    "Vault",
    "0xA57F00939D8597DeF1965FF4708921c56D9A36f3"
  );

  const timelock = await contractAt(
    "Timelock",
    "0x8D0De55e339b8CC62eC98A05aA46b6F352dE4054"
  );
  const router = await contractAt("Router", await vault.router());
  const weth = await contractAt("WETH", tokens.nativeToken.address);

  const referralStorage = await contractAt(
    "ReferralStorage",
    "0xcFB491149F0a037EfcF5A0323cc460C8a83635Fa"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x230a476D100Bba2f76edBDF1300df3f963d943Dd"
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "100000000000000"; // 0.0001 ETH
  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee,
  };
}

async function getArbValues(signer) {
  const vault = await contractAt(
    "Vault",
    "0xec45801399EB38B75A3bf793051b00bb64fF3eF8"
  );
  const timelock = await contractAt("Timelock", await vault.gov(), signer);
  const router = await contractAt("Router", await vault.router(), signer);
  const weth = await contractAt("WETH", tokens.nativeToken.address);
  const referralStorage = await contractAt(
    "ReferralStorage",
    "0xDE83088F2bcB974A349E6347Dc75919ecC0dD6f0"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x857c831fE590c472a222AbF62131906e5d038330",
    signer
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "100000000000000"; // 0.0001 ETH

  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee,
    positionKeepers,
  };
}

async function getAvaxValues(signer) {
  const vault = await contractAt(
    "Vault",
    "0x9ab2De34A33fB459b538c43f251eB825645e8595"
  );
  const timelock = await contractAt("Timelock", await vault.gov(), signer);
  const router = await contractAt("Router", await vault.router(), signer);
  const weth = await contractAt("WETH", tokens.nativeToken.address);
  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x827ED045002eCdAbEb6e2b0d1604cf5fC3d322F8"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x9234252975484D75Fd05f3e4f7BdbEc61956D73a",
    signer
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "20000000000000000"; // 0.02 AVAX

  return {
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    depositFee,
    minExecutionFee,
  };
}

async function getValues(signer) {
  if (network === "arbitrum") {
    return getArbValues(signer);
  }

  if (network === "avax") {
    return getAvaxValues(signer);
  }

  if (network === "testnet") {
    return getTestnetValues(signer);
  }

  if (network === "bsc") {
    return getBscValues(signer)
  }

  if (network === "harmony") {
    return getHarmonyValues(signer)
  }
}

async function main() {
  const signer = await getFrameSigner();
  const {
    vault,
    timelock,
    router,
    weth,
    shortsTracker,
    depositFee,
    minExecutionFee,
    referralStorage,
  } = await getValues(signer);

  const referralStorageGov = await contractAt(
    "Timelock",
    await referralStorage.gov()
  );

  const positionRouterArgs = [
    vault.address,
    router.address,
    weth.address,
    shortsTracker.address,
    depositFee,
    minExecutionFee,
  ];
  const positionRouter = await deployContract(
    "PositionRouter",
    positionRouterArgs
  );
  // const positionRouter = await contractAt(
  //   "PositionRouter",
  //   "0x9B25fb7d0af7B36d9dF9b872d1e80D42F0278168"
  // );

  await sendTxn(
    positionRouter.setReferralStorage(referralStorage.address),
    "positionRouter.setReferralStorage"
  );

  await sendTxn(
    referralStorageGov.signalSetHandler(
      referralStorage.address,
      positionRouter.address,
      true
    ),
    "referralStorage.signalSetHandler(positionRouter)"
  );

  await sendTxn(
    shortsTracker.setHandler(positionRouter.address, true),
    "shortsTracker.setHandler(positionRouter)"
  );

  await sendTxn(router.addPlugin(positionRouter.address), "router.addPlugin");

  await sendTxn(
    positionRouter.setDelayValues(1, 180, 30 * 60),
    "positionRouter.setDelayValues"
  );
  await sendTxn(
    timelock.setContractHandler(positionRouter.address, true),
    "timelock.setContractHandler(positionRouter)"
  );

  await sendTxn(
    positionRouter.setGov(await vault.gov()),
    "positionRouter.setGov"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
