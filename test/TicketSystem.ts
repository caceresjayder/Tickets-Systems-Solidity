const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketSystem Testing", () => {
  const setup = async ({ priceToPay = 1 }) => {
    const [owner, client] = await ethers.getSigners();
    const TicketsSystem = await ethers.getContractFactory("TicketSystem");
    const amountToFund = ethers.utils.parseEther("1");

    const deployed = await TicketsSystem.deploy(priceToPay, {
      value: amountToFund,
    });

    return {
      owner,
      client,
      deployed,
    };
  };

  describe("Deployment", () => {
    it("Sets price to pay to mint a ticket", async () => {
      const priceToPay = 2;

      const { deployed } = await setup({ priceToPay });

      const returnedPrice = await deployed.priceToPay();
      expect(priceToPay).to.equal(returnedPrice);
    });
    it("checks the owner address", async () => {
      const { owner, deployed } = await setup({});
      const ownerReturned = await deployed.ownerAddress();
      expect(ownerReturned).to.equal(owner.address);
    });
  });

  describe("minting test", () => {
    it("owner uses sefeMint function", async () => {
      const { owner, deployed } = await setup({});
      await deployed.safeMint();
      const mints = await deployed.ownerOf(0);
      expect(mints).to.equal(owner.address);
    });
    it("token metadata", async () => {
      const { deployed } = await setup({});

      await deployed.safeMint();

      const metadata = await deployed.tokenURI(0);
      const stringifiedMetadata = await Buffer.from(
        metadata,
        "base64"
      ).toString("ascii");
      const metadataJSONed = JSON.parse(stringifiedMetadata);
      expect(metadataJSONed).to.have.all.keys("tokenId");
    });
  });
  describe("buy process", () => {
    it("buy succesful", async () => {
      const priceToPay = ethers.utils.parseEther("1");
      const { owner, deployed } = await setup({ priceToPay });
      await deployed.buyToken({ value: priceToPay});
      const a = await deployed.ownerOf(0);
      expect(a).to.equal(owner.address);
    });
    it("balance change", async () => {
      const priceToPay = ethers.utils.parseEther("1");
      const { deployed } = await setup({ priceToPay });
      const a = await deployed.getBalance();
      await deployed.withdrawBalance();
      const b = await deployed.getBalance();
      expect(a).to.not.equal(b);
    });
    it("buy unsuccesful", async () => {
      const priceToPay = ethers.utils.parseEther("10000");
      const { deployed } = await setup({ priceToPay });
      await expect(deployed.buyToken()).to.be.revertedWith("Need to send 10000000000000000000000 wei");
    });
  });

  describe("client adding verify", () => {
    it("adding client", async () => {
      const client = {
        fullname: "Sam Smith",
        fisicalAddress: "Sprinfield Avenue",
        telefone: "015555555",
      };
      const { deployed } = await setup({});
      await deployed.createClient(
        client.fullname,
        client.fisicalAddress,
        client.telefone
      );
      let a = await deployed.clientData(0);
      expect(a.toString()).to.equal(
        [client.fullname, client.fisicalAddress, client.telefone].toString()
      );
    });
  });

  describe("redeem testing", () => {
    const priceToPay = ethers.utils.parseEther("0.01")
    it("verifiying existence after mint", async () => {
      const { deployed } = await setup({priceToPay});
      await deployed.buyToken({value: priceToPay});
      const a = await deployed.tokenSerial(0);
      let b = await deployed.tokenURI(0);
      const stringB = await Buffer.from(b, "base64").toString("ascii");
      b = JSON.parse(stringB);
      expect(b.tokenId).to.equal(a);
    });
    it("token burned", async () => {
      const { deployed } = await setup({priceToPay});
      await deployed.buyToken({value: priceToPay});
      await deployed.redeem(0);
      await expect(deployed.ownerOf(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
    it("client received", async () => {
      const client = {
        fullname: "Sam Smith",
        fisicalAddress: "Sprinfield Avenue",
        telefone: "015555555",
      };
      const { deployed } = await setup({priceToPay});
      await deployed.buyToken({value: priceToPay});
      await deployed.createClient(
        client.fullname,
        client.fisicalAddress,
        client.telefone
      );
      await deployed.redeem(0);
      const b = await deployed.sendClient();
      expect(b.toString()).to.equal(
        [client.fullname, client.fisicalAddress, client.telefone].toString()
      );
    });
  });
});
