task("request-new-comment", "request a new comment and a new critique for a DNA token")
    .addParam("contract", "The address of the DNA contract")
    .addParam("id", "The token id number")
    .setAction(async taskArgs => {
        
        const contractAddr = taskArgs.contract
        const tokenId = taskArgs.id
        const networkId = network.name
        console.log("Adding comment to an DNA token #", tokenId, " using DNA contract at address: ", contractAddr, " on network: ", networkId)
        const DynamicNFTArt = await ethers.getContractFactory("DynamicNFTArt")

        //Get signer
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Comment the token
        const dnaContract = new ethers.Contract(contractAddr, DynamicNFTArt.interface, signer)
        console.log("Token ID IS", tokenId)
        var result = await dnaContract.requestNewComment(tokenId).then(function (transaction) {
            console.log("Contract: ", contractAddr, "is instructed to add a comment to DNA token: ", tokenId, ", Tx hash: ", transaction.hash)
        })
        
        var critiqueResult = await dnaContract.requestNewCritique(tokenId).then(function (transaction) {
            console.log("Contract: ", contractAddr, "is instructed to add a critique to DNA token: ", tokenId, ", Tx hash: ", transaction.hash)
        })

        console.log("GETTING ART INFO BACK....")
        await dnaContract.getArtAt(1).then((data) => {
            console.log(data)
        })

    })

module.exports = {}