// const hre = require("hardhat");

// async function main() {
//   console.log("Starting deployment...");

//   // Get the contract factory
//   const Contract = await hre.ethers.getContractFactory("GhibliChain");
//   console.log("Contract factory initialized.");

//   // Replace this with your wallet address or any valid Ethereum address
//   const initialOwner = "0x4Fa558486d2185cA34DD4708E198d9f3fE6663f8";
//   console.log("Initial owner address:", initialOwner);

//   try {
//     console.log("Deploying contract...");
//     // Deploy the contract
//     const contract = await Contract.deploy(initialOwner);

//     console.log(
//       "Contract deployment transaction sent. Waiting for confirmation..."
//     );

//     console.log("Contract deployed successfully!");
//     console.log("Contract address:", await contract.getAddress());
//   } catch (error) {
//     console.error("Error during deployment:", error);
//   }
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Deployment failed:", error);
//     process.exit(1);
//   });
const hre = require("hardhat");

async function main() {
  const deployedContract = await hre.ethers.deployContract("GhibliChain", [
    "0x4Fa558486d2185cA34DD4708E198d9f3fE6663f8",
  ]);
  await deployedContract.waitForDeployment();
  console.log(`Counter contract deployed to ${deployedContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
