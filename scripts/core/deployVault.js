const { deployContract, contractAt, sendTxn } = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const { errors } = require("../../test/core/Vault/helpers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const { nativeToken } = tokens;

  const vault = await deployContract("Vault", []);
  // const vault = await contractAt("Vault", "0x547a29352421e7273eA18Acce5fb8aa308290523")
  // In bsc, we use multisig for gov address at initial
  const gov = {
    address:
      network === "bsc" ? "0x2B0Ae181FE6C13Bd40Acd3dC9ce5B0C323a9d8Ae" : network ==="harmony" ? "0x5678917FfEb77827Aafc33419E99DaCd707313a9" : "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517",
  };
  const shortsTracker = await deployContract(
    "ShortsTracker",
    [vault.address],
    "ShortsTracker"
  );
  // const shortsTracker = await contractAt("ShortsTracker", "0xc8982ffB4d5d3BA9265F550b690F9Cf015ca8eE8")
  await sendTxn(shortsTracker.setGov(gov.address), "shortsTracker.setGov");

  const usdg = await deployContract("USDG", [vault.address]);
  // const usdg = await contractAt("USDG", "0xB502B9C5d94d76d2623227Fb0c652d2734DeF7Cd")
  const router = await deployContract("Router", [
    vault.address,
    usdg.address,
    nativeToken.address,
  ]);
  // const router = await contractAt("Router", "0x8F6C84bF4fD74cE28E2fEC88111A4a26095d1aDF")
  // const secondaryPriceFeed = await deployContract("FastPriceFeed", [5 * 60])

  const vaultPriceFeed = await deployContract("VaultPriceFeed", []);
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0x307AF78aB7b4a11C3c0411b2872C2DE8337434d1")


  await sendTxn(
    vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)),
    "vaultPriceFeed.setMaxStrictPriceDeviation"
  ); // 0.05 USD
  await sendTxn(
    vaultPriceFeed.setPriceSampleSpace(1),
    "vaultPriceFeed.setPriceSampleSpace"
  );
  await sendTxn(
    vaultPriceFeed.setIsAmmEnabled(false),
    "vaultPriceFeed.setIsAmmEnabled"
  );

  const olp = await contractAt("OAP", "0x93746Ae82a533A986F287f3a54E3c2f83da43661");
  await sendTxn(
    olp.setInPrivateTransferMode(true),
    "olp.setInPrivateTransferMode"
  );

  const glpManager = await deployContract("GlpManager", [
    vault.address,
    usdg.address,
    olp.address,
    shortsTracker.address,
    15 * 60,
  ]);
  await sendTxn(
    glpManager.setInPrivateMode(true),
    "glpManager.setInPrivateMode"
  );

  await sendTxn(olp.setMinter(glpManager.address, true), "olp.setMinter");
  await sendTxn(usdg.addVault(glpManager.address), "usdg.addVault(glpManager)");

  await sendTxn(
    vault.initialize(
      router.address, // router
      usdg.address, // usdg
      vaultPriceFeed.address, // priceFeed
      toUsd(2), // liquidationFeeUsd
      100, // fundingRateFactor
      100 // stableFundingRateFactor
    ),
    "vault.initialize"
  );

  await sendTxn(
    vault.setFundingRate(60 * 60, 100, 100),
    "vault.setFundingRate"
  );

  await sendTxn(vault.setInManagerMode(true), "vault.setInManagerMode");
  await sendTxn(vault.setManager(glpManager.address, true), "vault.setManager");

  await sendTxn(
    vault.setFees(
      10, // _taxBasisPoints
      5, // _stableTaxBasisPoints
      20, // _mintBurnFeeBasisPoints
      20, // _swapFeeBasisPoints
      1, // _stableSwapFeeBasisPoints
      10, // _marginFeeBasisPoints
      toUsd(2), // _liquidationFeeUsd
      24 * 60 * 60, // _minProfitTime
      true // _hasDynamicFees
    ),
    "vault.setFees"
  );

  const vaultErrorController = await deployContract("VaultErrorController", []);
  await sendTxn(
    vault.setErrorController(vaultErrorController.address),
    "vault.setErrorController"
  );
  await sendTxn(
    vaultErrorController.setErrors(vault.address, errors),
    "vaultErrorController.setErrors"
  );

  const vaultUtils = await deployContract("VaultUtils", [vault.address]);
  await sendTxn(vault.setVaultUtils(vaultUtils.address), "vault.setVaultUtils");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
