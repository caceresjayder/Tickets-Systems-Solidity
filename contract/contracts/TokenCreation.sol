// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract TokenCreation {
    function createTokenDNA(address _account, uint256 _tokenId) public pure returns(uint256){
        uint256 combinedParameters = _tokenId + uint160(_account);
        bytes memory encodedParams = abi.encodePacked(combinedParameters);
        bytes32 hashedParams = keccak256(encodedParams);
        return uint256(hashedParams);
    }
}