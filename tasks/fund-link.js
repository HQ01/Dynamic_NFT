let {networkConfig, getNetworkIdFromName } = require('../network-configs')

task("fund-link", "Funds a chainlink contract with LINK tokens")
    .addParam("contract", "The address of the contract")
    .addOptionalParam("linkAddress", "The LINK token address")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        let networkId = await getNetworkIdFromName(network.name)
        console.log("Funding contract: ", contractAddr, " on network: ", network.name)
        let linkTokenAddress = networkConfig[networkId]['linkToken'] || taskArgs.linkAddress
        const LinkToken = await ethers.getContractFactory("LinkToken")

        //Fund amount
        const fund = web3.utils.toHex(1e18)

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Transfer LINK to the contract
        const linkTokenContract = new ethers.Contract(linkTokenAddress, LinkToken.interface, signer)
        var result = await linkTokenContract.transfer(contractAddr, fund).then(function (transaction) {
            console.log("Contract: ", contractAddr, " is funded with 1 LINK. Transaction hash: ", transaction.hash)
        })
    })

module.exports = {}