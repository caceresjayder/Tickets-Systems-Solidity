// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './TransfersProcess.sol';
import './TokenCreation.sol';



contract TicketSystem is ERC721, Ownable, ERC721Enumerable, TokenCreation, SendEther, ReceiveEther {
    
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _clientId;
    Counters.Counter private _clientToRedeem;
    mapping(uint256 => uint256) public tokenSerial;
    mapping(uint256 => client) public clientData;
    uint256 public priceToPay;
    address payable public ownerAddress;
    address payable public contractAddress;
    client private _client;

    struct client {
        string fullName;
        string fisicalAddress;
        string telefone;
    }

    constructor(uint256 _priceToPay) payable ERC721('TokenName', 'TNM'){
        priceToPay = _priceToPay;
        ownerAddress = payable(msg.sender);
        contractAddress = payable(address(this));

    }

    function setPriceToPay(uint256 _priceToPay) public onlyOwner{
        priceToPay = _priceToPay;
    }

    function safeMint() public onlyOwner{
        uint256 tokenId = _tokenIdCounter.current();
        tokenSerial[tokenId] = createTokenDNA(msg.sender, tokenId);
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter.increment();
    }

    function buyToken() public payable{
        address buyer = msg.sender;
        require(msg.value == priceToPay, string.concat("Need to send ", Strings.toString(priceToPay), " wei"));
        require(sendEther(ownerAddress, priceToPay), "Payment Failed, Check your balance");
        uint256 tokenId = _tokenIdCounter.current();
        tokenSerial[tokenId] = createTokenDNA(buyer, tokenId);
        _safeMint(buyer, tokenId);
        _tokenIdCounter.increment();
    }

    function withdrawBalance() public onlyOwner{
        uint contractBalance = contractAddress.balance;
        uint toWithdraw = (contractBalance - ((contractBalance * 10) / 100));
        withdrawEther(ownerAddress, toWithdraw);
    }

    function sendClient() public view returns(client memory){
        return _client;
    }

    function redeem(uint256 tokenId) public{
        require(_exists(tokenId) && ownerOf(tokenId) == msg.sender, "You don't have tokens in this platform, try buying a token or with another wallet");
        uint256 clientToRedeem = _clientToRedeem.current();
        _clientToRedeem.increment();
        _burn(tokenId);
        _client = clientData[clientToRedeem];
    }

    function createClient(string memory _fullName, string memory _fisicalAddress, string memory _telefone) public onlyOwner{
        uint256 clientId = _clientId.current();
        clientData[clientId] = client(_fullName, _fisicalAddress, _telefone);
        _clientId.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        require(_exists(tokenId), 'ERC721 Metadata: URI query for nonexistent token');

        uint256 dna = tokenSerial[tokenId];
        
        string memory jsonURI = Base64.encode(
            abi.encodePacked(
                '{ "tokenId" : "', dna.toString(),'"}'
            )
        );
        return string(jsonURI);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}