import { ethers } from "hardhat";

async function main() {
  const TipPost = await ethers.getContractFactory("TipPost");
  const tipPost = await TipPost.deploy();
  await tipPost.waitForDeployment();

  const deployedAddress = await tipPost.getAddress();
  console.log(`TipPost deployed to: ${deployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
