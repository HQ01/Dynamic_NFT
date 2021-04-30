task("get-art-at", "get an exported view of a piece of artwork")
    .addParam("contract", "The address of the DNA contract")
    .addParam("id", "The token id number")
    .setAction(async taskArgs => {
        
        const contractAddr = taskArgs.contract
        const tokenId = taskArgs.id
        const networkId = network.name
        console.log("getting information at #", tokenId, " using DNA contract at address: ", contractAddr, " on network: ", networkId)
        const DynamicNFTArt = await ethers.getContractFactory("DynamicNFTArt")

        //Get signer
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Get info
        const dnaContract = new ethers.Contract(contractAddr, DynamicNFTArt.interface, signer)
        console.log("Token ID IS", tokenId)

        console.log("GETTING ART INFO BACK....")
        await dnaContract.getArtAt(1).then((data) => {
            console.log(data)
        })

    })

module.exports = {}