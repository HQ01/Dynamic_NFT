// const { hexStripZeros } = require("@ethersproject/bytes")
// const { ethers } = require("ethers")
task("mint-nft", "mint a Dynamic NFT Art token")
    .addParam("contract", "The address of the DNA contract")
    .addParam("uri", "The URI corresponding to this token")
    .addParam("name", "The artwork's name")
    .addOptionalParam("receipient", "[Optional] The address (public key) of the receipient")
    .setAction(async taskArgs => {
        
        const contractAddr = taskArgs.contract
        const receipient = taskArgs.receipient
        const uri = taskArgs.uri
        const name = taskArgs.name
        const networkId = network.name
        console.log("Minting an DNA token using DNA contract at address: ", contractAddr, " on network: ", networkId)
        const DynamicNFTArt = await ethers.getContractFactory("DynamicNFTArt")

        //Get signer
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Mint the token
        const dnaContract = new ethers.Contract(contractAddr, DynamicNFTArt.interface, signer)
        console.log("PUBLIC KEY IS ", signer.address)
        console.log("URI IS", uri)
        var result = await dnaContract.mintDNA(signer.address, uri, name).then(function (transaction) {
            console.log("Contract: ", contractAddr, "is instructed to mint a DNA token, Tx hash: ", transaction.hash)
            console.log("Receipient: ", signer.address)
            console.log("Run the following to modify the token:")
            console.log("npx hardhat request-new-comments")
        })
    })

module.exports = {}