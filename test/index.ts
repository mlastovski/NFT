import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, BigNumber } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("NFT721", function () {
  let NFT721: ContractFactory;
  let nft721: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  beforeEach(async function () {
    NFT721 = await ethers.getContractFactory("NFT721");
    nft721 = await NFT721.deploy();
    await nft721.deployed();
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Mint: Should mint properly", async function () {
    await nft721.connect(owner).mint(process.env.URI_1);
    await nft721.connect(addr1).mint(process.env.URI_2);

    expect(await nft721.balanceOf(owner.address)).to.equal(1);
    expect(await nft721.balanceOf(addr1.address)).to.equal(1);
  });

  it("Token URI: Should return correct URI", async function () {
    await nft721.connect(owner).mint(process.env.URI_1);
    expect(await nft721.tokenURI(1)).to.equal(process.env.URI_1);
  });

  it("Transfer: Should transfer", async function () {
    // const balance_before = await nft721.balanceOf(owner.address);
    // console.log(balance_before);
    await nft721.connect(owner).mint(process.env.URI_1);
    // const balance_after = await nft721.balanceOf(owner.address);
    // console.log(balance_after);
    await nft721.connect(owner).transferFrom(owner.address, addr1.address, 1);

    expect(await nft721.balanceOf(addr1.address)).to.equal(1);
    expect(await nft721.balanceOf(owner.address)).to.equal(0);
    expect(await nft721.ownerOf(1)).to.equal(addr1.address);
  });

    it("Transfer: Should safeTransferFrom", async function () {
      await nft721.connect(owner).mint(process.env.URI_1);
      // await nft721.safeTransferFrom(owner.address, addr1.address, 1); not working
      await nft721["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1);

      expect(await nft721.balanceOf(addr1.address)).to.equal(1);
      expect(await nft721.ownerOf(1)).to.equal(addr1.address);
    });

    it("Transfer: Should safeTransferFrom with bytes", async function () {
      await nft721.connect(owner).mint(process.env.URI_1);
      await nft721["safeTransferFrom(address,address,uint256,bytes)"](owner.address, addr1.address, 1, "0x");

      expect(await nft721.balanceOf(addr1.address)).to.equal(1);
      expect(await nft721.ownerOf(1)).to.equal(addr1.address);
    });

    it("Transfer: Should fail to transfer (insufficient allowance)", async function () {
      await nft721.connect(owner).mint(process.env.URI_1);
      await expect(nft721.connect(addr1).transferFrom(owner.address, addr2.address, 1)).to.be.revertedWith("ERC721: caller is not token owner nor approved");
    });

    it("Approval: Should approve", async function () {
      await nft721.connect(owner).mint(process.env.URI_1);
      await nft721.approve(addr1.address, 1);
      await nft721.connect(addr1).transferFrom(owner.address, addr2.address, 1);

      expect(await nft721.balanceOf(addr2.address)).to.equal(1);
      expect(await nft721.ownerOf(1)).to.equal(addr2.address);
    });

    it("Approval: Should fail to approve (ERC721: caller is not token owner nor approved)", async function () {
      await nft721.connect(owner).mint(process.env.URI_1);
      await nft721.approve(addr1.address, 1);
      await expect(nft721.connect(addr2).transferFrom(owner.address, addr2.address, 1)).to.be.revertedWith("ERC721: caller is not token owner nor approved");
    });

    it("Approval: Should setApprovalForAll and emit corresponding event", async function () {
      await nft721.mint(process.env.URI_1);
      expect(await nft721.setApprovalForAll(addr1.address, true)).to.emit(nft721, "ApprovalForAll").withArgs(owner.address, addr1.address, true);
    });

    it("Events: Emit Transfer", async function () {
      expect(await nft721.mint(process.env.URI_1)).to.emit(nft721, "Transfer").withArgs('0', owner.address, 1);
    });

    it("Events: Emit Approval", async function () {
      await nft721.mint(process.env.URI_1);
      expect(await nft721.approve(addr1.address, 1)).to.emit(nft721, "Approval").withArgs(owner.address, addr1.address, 1);
    });
});

describe("NFT1155", function() {
  let NFT1155: ContractFactory;
  let nft1155: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  beforeEach(async function() {
    NFT1155 = await ethers.getContractFactory("NFT1155");
    nft1155 = await NFT1155.deploy();
    await nft1155.deployed();
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Mint: Should mint", async function () {
    await nft1155.mint(addr1.address, 1, 1, "0x");
    await nft1155.mint(addr2.address, 2, 1, "0x");
    await nft1155.mint(addr3.address, 3, 1, "0x");

    expect(await nft1155.balanceOf(addr1.address, 1)).to.equal(1);
    expect(await nft1155.balanceOf(addr2.address, 2)).to.equal(1);
    expect(await nft1155.balanceOf(addr3.address, 3)).to.equal(1);
  });

  it("Mint: Should fail to mint (Ownable: caller is not the owner)", async function () {
    await expect(nft1155.connect(addr1).mint(addr1.address, 1, 1, "0x")).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Mint: Should mintBatch", async function () {
    await nft1155.mintBatch(addr1.address, [1, 2, 3], [8, 8, 8], "0x");

    expect(await nft1155.balanceOf(addr1.address, 1)).to.equal(8);
    expect(await nft1155.balanceOf(addr1.address, 2)).to.equal(8);
    expect(await nft1155.balanceOf(addr1.address, 3)).to.equal(8);
  });

  it("Events: Should emit TransferSingle", async function () {
    expect(await nft1155.mint(addr1.address, 1, 1, "0x")).to.emit(nft1155, "TransferSingle").withArgs(owner.address, ethers.constants.AddressZero, owner.address, 1, 1, "0x0");
  });

  it("Events: Should emit TransferSingle", async function () {
    expect(await nft1155.safeTransferFrom(owner.address, addr1.address, 1, 1, "0x")).to.emit(nft1155, "TransferSingle").withArgs(owner.address, owner.address, addr1.address, 1, 1, "0x0");
  });

  it("Events: Should emit TransferBatch", async function () {
    expect(await nft1155.safeBatchTransferFrom(owner.address, addr1.address, [1, 2, 3, 4], [1, 1, 1, 1], "0x")).to.emit(nft1155, "TransferBatch").withArgs(owner.address, owner.address, addr1.address, [1, 2, 3, 4], [1, 1, 1, 1], "0x0");
  });

  it("URI: Should return URI by id", async function () {
    await nft1155.mint(addr1.address, 1, 1, "0x");
    expect(await nft1155.uri(1)).to.equal("https://ipfs.io/ipfs/bafybeibluxooouekfbn6l535gp5asupnjkbdfb7ekryglkq5txflxwodca/1.json");
    
  });

  it("SafeTransferBatch and Approval: Should approve and safeTransferBatch", async function () {
    await nft1155.setApprovalForAll(addr1.address, true);
    await nft1155.setApprovalForAll(addr2.address, true);
    await nft1155.connect(addr1).safeTransferFrom(owner.address, addr3.address, 1, 1, "0x");
    await nft1155.connect(addr2).safeBatchTransferFrom(owner.address, addr3.address, [2, 3], [1, 1], "0x");

    expect(await nft1155.balanceOf(addr3.address, 1)).to.equal(1);
    expect(await nft1155.balanceOf(addr3.address, 2)).to.equal(1);
    expect(await nft1155.balanceOf(addr3.address, 3)).to.equal(1);
  });

  it("Should update balances after batch transfer", async function () {
    const balanceBefore = await nft1155.balanceOfBatch([owner.address, owner.address, owner.address], [1, 2, 3]);
    // console.log(balancesBefore);
    await nft1155.safeBatchTransferFrom(owner.address, addr1.address, [1, 2, 3], [1, 1, 1], "0x");
    const balanceAfter = await nft1155.balanceOfBatch([owner.address, owner.address, owner.address], [1, 2, 3]);
    // console.log(balancesAfter);
    expect(balanceAfter[0]).to.equal(balanceBefore[0].sub(1));
    expect(balanceAfter[1]).to.equal(balanceBefore[1].sub(1));
    expect(balanceAfter[2]).to.equal(balanceBefore[2].sub(1));
  });

  it("Ownership: Should transfer ownership", async function () {
    await nft1155.transferOwnership(addr1.address);
    expect(await nft1155.owner()).to.equal(addr1.address);
    await expect(nft1155.mint(owner.address, 1, 1, "0x")).to.be.revertedWith("Ownable: caller is not the owner");
    await nft1155.connect(addr1).mint(addr1.address, 2, 1, "0x");
    expect(await nft1155.balanceOf(addr1.address, 2)).to.equal(1);
  });
});
