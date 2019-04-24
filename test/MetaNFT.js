const {
  BN,
  constants,
  expectEvent,
  shouldFail
} = require("openzeppelin-test-helpers");
const should = require("chai").should();

const MetaNFT = artifacts.require("MetaNFT");
const gas = 5000000

contract("MetaNFT", async ([_, owner, ...otherAccounts]) => {
  let instance;
  const name = "MNFT";
  const symbol = "MNFT";

  beforeEach(async function() {
    instance = await MetaNFT.new();
    await instance.methods["initialize(string,string,address[],address[])"](
      name,
      symbol,
      [owner],
      [owner],
      { from: owner, gas }
    );
  });

  it("should have a proper name + symbol", async () => {
    (await instance.name()).should.equal(name);
    (await instance.symbol()).should.equal(symbol);
  });

  it("should mint a token with uri", async () => {
    const uri = "First Token";
    const tokenID = 0;
    const tx = instance.mintWithTokenURI(owner, tokenID, uri, {from: owner, gas});
    (await instance.tokenURI(tokenID)).should.equal(uri);
  });
});
