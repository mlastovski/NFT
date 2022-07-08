import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

const contractAddress = "0x16B8aEC0B12a95d6fcFdB5d68dca41929c7DA7a6";

task("mint721", "Mint 721 nft")
  .addParam("uri", "URI json link")
  .setAction(async (taskArgs, hre) => {
    const Token = await hre.ethers.getContractFactory("NFT721");
    const tokenContract = Token.attach(contractAddress);
    const output = await tokenContract.mint(taskArgs.uri);
    console.log(output);
  });
