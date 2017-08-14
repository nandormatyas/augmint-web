var TokenUcd = artifacts.require("./TokenUcd.sol");
var Rates = artifacts.require("./Rates.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var LoanManager = artifacts.require("./LoanManager.sol");

module.exports = function(deployer, network) {
    deployer.link(SafeMath, LoanManager);
    deployer.deploy(LoanManager, TokenUcd.address, Rates.address);
};