pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicNFTArt is ERC721, VRFConsumerBase, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    bytes32 internal keyHash;
    uint256 internal fee;
    AggregatorV3Interface internal priceFeed;

    address public VRFCoordinator;
    address public PriceFeedAddress;
    address public LinkToken;


    struct ArtWork {
        uint256 id;
        string name;
        address author;
        string uri;
    }

    struct ArtExported {
        uint256 id;
        string name;
        address author;
        string uri;
        address[] Commentators;
        uint256[] Comments;
        address[] Critics;
        int[] Critiques;
    }

    ArtWork[] public works;
    // mapping(uint256 => string[]) exCritiques;
    mapping(uint256 => address[]) idToCommentators;
    mapping(uint256 => uint256[]) idToComments;
    mapping(uint256 => address[]) idToCritics;
    mapping(uint256 => int[]) idToCritiques;

    mapping(bytes32 => string) requestToArtName;
    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;

    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash, address _priceFeed)
        public
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("DynamicNFTArt", "DNA")
    {
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        keyHash = _keyhash;
        PriceFeedAddress = _priceFeed;
        priceFeed = AggregatorV3Interface(_priceFeed);
        fee = 0.1 * 10**18; //0.1 unit of LINK

    }

    function mintDNA(address recipient, string memory tokenURI, string memory name)
        public onlyOwner
        returns (uint256)
    {
        uint256 id = works.length + 1;
        ArtWork memory art;
        art.id = id;
        art.name = name;
        art.uri = tokenURI;
        art.author = recipient;
        works.push(art);
        _safeMint(recipient, id);
        _setTokenURI(id, tokenURI);

        return id;
    }

    function requestNewComment(uint256 id) 
        public onlyOwner
        returns (bytes32)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK -- get some from the faucet!"
        );
        bytes32 requestId = requestRandomness(keyHash, fee, 42);
        requestToTokenId[requestId] = id;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 workId = requestToTokenId[requestId];
        idToCommentators[workId-1].push(VRFCoordinator);
        idToComments[workId-1].push(randomNumber);
    }

    function requestNewCritique(uint256 id)
        public onlyOwner
    {
        (
            uint80 roundId,
            int price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        idToCritics[id-1].push(PriceFeedAddress);
        idToCritiques[id-1].push(price);
    }


    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string calldata _tokenURI) external {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC 721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    function getArtAt(uint256 id)
        public
        view
        returns (
            ArtExported memory
        )
    {
        return ArtExported(
            works[id-1].id,
            works[id-1].name,
            works[id-1].author,
            works[id-1].uri,
            idToCommentators[id-1],
            idToComments[id-1],
            idToCritics[id-1],
            idToCritiques[id-1]
        );
    }

}