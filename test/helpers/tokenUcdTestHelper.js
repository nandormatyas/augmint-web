var TokenUcd = artifacts.require("./TokenUcd.sol");
//var testHelper = new require("./testHelper.js");

module.exports = {
    newTokenUcd: newTokenUcd
};

function newTokenUcd(initialUcdBalance, userAccount) {
    return new Promise(async function(resolve, reject) {
        let instance = await TokenUcd.new();
        if (initialUcdBalance > 0) {
            await instance.issueUcd(initialUcdBalance);
            await instance.getUcdFromReserve(initialUcdBalance);
            if (userAccount != null) {
                await instance.transfer(userAccount, initialUcdBalance);
            }
        }
        resolve(instance);
    });
}
