# Tickets System with Solidity.

Welcome!!! 
If you are looking for this, don't doubt to fork and leave a star.
Project maded with Hardhat framework and Solidity.
To start:

```
git clone https://github.com/caceresjayder/Tickets-Systems-Solidity.git
```
Enter to folder:
```
cd Tickets-Systems-Solidity
```
Install dependencies:
```
npm install
```
Deploy:
```
npx hardhat run scripts/deploy.ts
```

When deploying in Mainnet or Testnet you have to provide **Balance** and **Price of Token** in ethers.

The Contract counts with 8 functions:

- **setPriceToPay(uint256 _priceToPay) :**
		Only Owner; sets price of token if ocurr some variation in the price.
		
- **safeMint():**
		Only Owner; owner can mint token.
		
- **buyToken():**
	Public; user can buy a token in the system and pay the priceToPay.
	
- **withdrawBalance():**
	Only Owner; owner can withdraw funds from contract minor 10% for contract gas fees operations.
	
- **sendClient():**
	view function; sends the information redeemded.
	
- **redeem( uint256 tokenId):**
	Public; allow to user to redeem the previous buyed token for information.
	
- **createClient(arg1,arg2,arg3):**
	Only Owner; works with struct, saves the data in the clientData mapping, configurable.
	
- **tokenURI(uint256 tokenId):**
	Public; generates the tokenURI.

The order to redeem data information is **FIFO**
