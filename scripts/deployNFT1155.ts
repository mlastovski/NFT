import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("NFT1155");
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("NFT1155 deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
