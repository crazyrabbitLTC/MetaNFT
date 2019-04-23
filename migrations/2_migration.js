const MetaNFT = artifacts.require("MetaNFT");

module.exports = function(deployer) {
  deployer.deploy(MetaNFT);
};
