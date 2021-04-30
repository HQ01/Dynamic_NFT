/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-web3")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy")
require("./tasks/fund-link")
require("./tasks/mint-nft")
require("./tasks/request-new-comment")


require('dotenv').config()
const {API_URL, PRIVATE_KEY, PUBLIC_KEY, RINKEBY_API_URL} = process.env;
module.exports = {
	solidity: {
        compilers: [
            {
                version: "0.6.6"
            },
        ]
    },
  defaultNetwork: "rinkeby",
  networks : {
	hardhat: {},
	kovan: {
	  url: API_URL,
	  accounts: [`0x${PRIVATE_KEY}`]
	},
	rinkeby: {
	  url: RINKEBY_API_URL,
	  accounts: [`0x${PRIVATE_KEY}`]
	}
  },
  namedAccounts: {
	deployer: {
		default: 0, // here this will by default take the first account as deployer
		1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
	},
	feeCollector: {
		default: 1
	}
  },
  etherscan: {
	  apiKey: "C3TKS51BA69NJ7EWRWBSR2IY9V9QRJWQQA"
  }
};
