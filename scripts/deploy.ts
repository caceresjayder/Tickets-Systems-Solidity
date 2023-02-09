import { ethers } from "hardhat";

async function main() {
  const [ deployer ] = await ethers.getSigners();
  const priceToPay = ethers.utils.parseEther('0.005');
  console.log("Deploying contract with the account", deployer.address);
  const amountToFund = ethers.utils.parseEther('1');
  const TicketsSystem = await ethers.getContractFactory('TicketSystem');
  const deployed = await TicketsSystem.deploy(priceToPay, {value: amountToFund})

  console.log("Deployed in: ", deployed.address)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
