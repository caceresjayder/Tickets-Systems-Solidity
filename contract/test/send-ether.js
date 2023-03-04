const { expect } = require("chai");
const { ethers } = require("hardhat");

//const addressToFund = process.env.ADDRESS_TO_FUND || "0FDc6c84f5928ee00D894d90E398CC6f53871949"


describe("SendEther", function () {

  it("Should deploy", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();
  });

  it("Can send if is the owner", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    await send_ether.connect(wallet).sendEther(
	    wallet.address,  7000000000000000, {value: 7000000000000000});

  })

  it("Can't send if payment amount differ from price", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    await expect(
      send_ether.connect(wallet).sendEther( wallet.address,
	      700000000000000, {value: 8000000000000000})
    ).to.be.revertedWith('El monto del pago no es igual al precio')
  })


  it("Can send if is not the owner", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const [owner, other] = await ethers.getSigners();
    const wallet = [owner, other ];

    await expect(
      send_ether.connect(other).sendEther( other.address,  7000000000000000, {value: 7000000000000000})
    ).not.to.be.revertedWith("Payment Failed")
  })


  it("Can withdraw if is the owner", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    await send_ether.connect(wallet).withdrawEther( wallet.address,  7000000000000000, {value: 7000000000000000});

  })

  it("Can't withdraw if payment amount differ from price", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    await expect(
      send_ether.connect(wallet).withdrawEther( wallet.address,  700000000000000, {value: 8000000000000000})
    ).to.be.revertedWith('El monto del pago no es igual al precio')
  })


  xit("Can't withdraw if payment amount is higher than contract balance", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    const provider = ethers.getDefaultProvider();

    const balance = await provider.getBalance(send_ether.address);
    console.log("Balance del contracto en la dirección:");
    console.log( send_ether.address);
    console.log( balance );

    await expect(
      send_ether.connect(wallet).withdrawEther( wallet.address, (balance + 1), {value: (balance + 1)})
    ).to.be.revertedWith('Transaction Failed')
  })


  xit("Balance should decrease after the withdrawal", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0];

    const provider = ethers.getDefaultProvider();
    const balance_before_withdrawal = await provider.getBalance(send_ether.address);
    console.log("Balance del contracto en la dirección:");
    console.log( send_ether.address);
    console.log( balance_before_withdrawal );
    send_ether.connect(wallet).withdrawEther( wallet.address, 100, {value: 100});

    const balance_after_withdrawal = await provider.getBalance(send_ether.address);
    console.log("Balance del contracto en la dirección:");
    console.log( send_ether.address);
    console.log( balance_after_withdrawal );

    await expect(
      balance_after_withdrawal - balance_before_withdrawal
    ).to.eq( 0 )
  })



  it("Can send if is not the owner", async function () {
    const SendEther = await ethers.getContractFactory("SendEther");
    const send_ether = await SendEther.deploy();
    await send_ether.deployed();

    const [owner, other] = await ethers.getSigners();
    const wallet = [owner, other ];

    await expect(
      send_ether.connect(other).withdrawEther( other.address,  7000000000000000, {value: 7000000000000000})
    ).not.to.be.revertedWith("Payment Failed")
  })


  xit("Can't withdraw when balance is 0",  async function () {
    const [wallet1] = await hre.ethers.getSigners()
    await wallet1.sendTransaction({
      to: wallet1.address,
      value: ethers.utils.parseEther("10.0")
    });
    console.log("Transferred 10 ETH to ", wallet1.address)
    const provider = hre.ethers.getDefaultProvider();
    const balance_before_withdrawal = await provider.getBalance(wallet1.address);
    console.log("Balance de la cuenta en la dirección:");
    console.log( wallet1.address);
    console.log( balance_before_withdrawal );
   });
});
