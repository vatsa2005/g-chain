require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables from a .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Infura/Alchemy RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Wallet private key
    },
  },
};

// require("dotenv").config();
// require("@nomicfoundation/hardhat-toolbox");

// module.exports = {
//   solidity: "0.8.20",
//   paths: {
//     artifacts: "./src",
//   },
//   networks: {
//     opencampus: {
//       url: `https://rpc.open-campus-codex.gelato.digital/`,
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY],
//     },
//   },
//   etherscan: {
//     apiKey: {
//       opencampus: "KYFXZC8T9AUHZ1UM4X5TAXSQMQ3K7JN8TY",
//     },
//     customChains: [
//       {
//         network: "opencampus",
//         chainId: 656476,
//         urls: {
//           apiURL: "https://opencampus-codex.blockscout.com/api",
//           browserURL: "https://opencampus-codex.blockscout.com",
//         },
//       },
//     ],
//   },
// };
