pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/token/ERC721/StandaloneERC721.sol";
import "zos-lib/contracts/Initializable.sol";

contract MetaNFT is Initializable, StandaloneERC721 {
    
    bool public isReady = false;
    function initialize(string memory name, string memory symbol, address[] memory minters, address[] memory pausers) public initializer {
    StandaloneERC721.initialize(name, symbol, minters, pausers);
    isReady = true;
    }

    function isTokenReady() public view returns(bool){
        return isReady;
    }
}
