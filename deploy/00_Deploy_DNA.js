// const { ethers } = require("hardhat");

// async function main() {
//     const DNA = await ethers.getContractFactory("DynamicNFTArt");
//     const dna = await DNA.deploy();
//     console.log("Contract deployed to: ", dna.address);
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });


const { getNamedAccounts } = require('hardhat')
let {networkConfig} = require('../network-configs')

module.exports = async({
    getNameAccounts,
    deployments,
    getChainId
}) => {
    const {deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    log("Deployer is:   " + deployer)
    log("ChainId is:  " + chainId)

    const linkTokenAddress = networkConfig[chainId]['linkToken']
    const vrfCoordinatorAddress = networkConfig[chainId]['vrfCoordinator']
    const keyHash = networkConfig[chainId]['keyHash']
    const fee = networkConfig[chainId]['fee']
    const ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']

    const dna = await deploy('DynamicNFTArt', {
        from: deployer,
        args: [vrfCoordinatorAddress, linkTokenAddress, keyHash, ethUsdPriceFeedAddress],
        log: true
    })

    log("------ DNA contract address is " + dna.address)
}