const MetaNFT = artifacts.require("MetaNFT");

// module.exports = function(deployer) {
//   deployer.then(function () {
//     return MetaNFT.new();
//   }).then(function(instance){
//     instance.initialize("DenToken", "DT", ['0x0A342460053e4621F692B14DF2E966788350642B'],['0x0A342460053e4621F692B14DF2E966788350642B'])
//   })
// };


module.exports = function(deployer) {
  deployer.deploy(MetaNFT, {overwrite: true});
};
