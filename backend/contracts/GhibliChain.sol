// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GhibliChain is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    struct Story {
        uint256 storyId;
        address creator;
        string title;
        uint256[] frameIds;
    }

    struct NFTMetadata {
        uint256 likes;
        string[] comments;
    }

    mapping(uint256 => Story) public stories;
    mapping(uint256 => uint256) public nftToStory;
    mapping(uint256 => NFTMetadata) public nftMetadata;

    event StoryCreated(uint256 storyId, string title, address creator);
    event FrameMinted(uint256 storyId, uint256 tokenId, string tokenURI);
    event NFTLiked(uint256 tokenId, uint256 likes);
    event NFTCommented(uint256 tokenId, string comment);

    constructor(
        address initialOwner
    ) ERC721("GhibliChainNFT", "GHIBLI") Ownable(initialOwner) {
        tokenCounter = 0;
    }

    function createStory(string memory title) public returns (uint256) {
        uint256 storyId = tokenCounter;
        stories[storyId] = Story(storyId, msg.sender, title, new uint256[](0));
        emit StoryCreated(storyId, title, msg.sender);
        tokenCounter++;
        return storyId;
    }

    function mintFrame(uint256 storyId, string memory tokenURI) public {
        require(stories[storyId].creator == msg.sender, "Not the story owner");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        stories[storyId].frameIds.push(tokenId);
        nftToStory[tokenId] = storyId;
        nftMetadata[tokenId] = NFTMetadata(0, new string[](0));

        emit FrameMinted(storyId, tokenId, tokenURI);
        tokenCounter++;
    }

    function getStoryFrames(
        uint256 storyId
    ) public view returns (uint256[] memory) {
        return stories[storyId].frameIds;
    }

    function likeNFT(uint256 tokenId) public {
        nftMetadata[tokenId].likes++;
        emit NFTLiked(tokenId, nftMetadata[tokenId].likes);
    }

    function commentNFT(uint256 tokenId, string memory comment) public {
        nftMetadata[tokenId].comments.push(comment);
        emit NFTCommented(tokenId, comment);
    }

    function getNFTMetadata(
        uint256 tokenId
    ) public view returns (uint256 likes, string[] memory comments) {
        return (nftMetadata[tokenId].likes, nftMetadata[tokenId].comments);
    }
}
