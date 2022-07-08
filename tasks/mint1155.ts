// import * as dotenv from "dotenv";
// import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-waffle";
// dotenv.config();

// const contractAddress = "0xC8F4c0f2dD2aaf357997C0Cd27592E2Cd8584d54";

// task("mint721", "Mint 721 nft")
//   .addParam("to", "address to")
//   .addParam("id", "token id")
//   .addParam("amount", "amount to mint")
//   .setAction(async (taskArgs, hre) => {
//     const Token = await hre.ethers.getContractFactory("NFT721");
//     const tokenContract = Token.attach(contractAddress);
//     const output = await tokenContract.mint(taskArgs.to, taskArgs.id, taskArgs.amount, "0x12");
//     console.log(output);
//   });
