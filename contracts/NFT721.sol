//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NFT721 is ERC721 {
    uint256 tokenCounter;

    constructor() ERC721("SHTPST", "Shitpost") {
        tokenCounter = 1;
    }

    mapping(uint256 => string) private _URIs;

    function mint(string memory _tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        tokenCounter = tokenCounter + 1;

        return newItemId;
    }

    function _setTokenURI(uint256 id, string memory _tokenURI) internal {
        _URIs[id] = _tokenURI;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return _URIs[id];
    }
}
