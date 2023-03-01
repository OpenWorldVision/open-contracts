const { contractAt, sendTxn } = require("./shared/helpers")

async function main() {
    const oapRouter = await contractAt("OapRouter","0x00F8f46081192F4F5a28239F3dd3212257362810");
     await sendTxn(oapRouter.setWhitelistToken("0x78867bbeef44f2326bf8ddd1941a4439382ef2a7", true));
}

main().then(() => process.exit(0)).catch(error => {
    console.log(error);
    process.exit(1)
})