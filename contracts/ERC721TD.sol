// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IExerciceSolution.sol";



contract ERC721TD is ERC721 {

    // set contract name and ticker. 
    constructor (string memory name_, string memory symbol_, address to_, uint256 tokenid_) public ERC721(name_, symbol_){
        _mint(to_, tokenid_);
    }

}