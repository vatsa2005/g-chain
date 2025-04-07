"use client";
import { useState, useEffect } from "react";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { ethers } from "ethers";
import contractData from "../contractABI.json";
const abi = contractData.abi;
import React from "react";

const GalleryPage = () => {
  const [nfts, setNfts] = useState<
    { tokenId: number; tokenURI: string; likes: number; comments: string[] }[]
  >([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null); // State for fullscreen image
  // const contractAddress = "0x21321036Dc1238411840F86F253F923B11f89AEb";
  const contractAddress = "0x9D4e333174A90fDd4F8f419e5183592a488A2dbA"; // Replace with your contract address

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask to use this feature.");
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // Fetch the total number of tokens
        const totalTokens = await contract.tokenCounter();
        const totalStories = totalTokens.toNumber(); // Convert BigNumber to a number

        let items: {
          tokenId: number;
          tokenURI: string;
          likes: number;
          comments: string[];
        }[] = [];

        // Loop through all stories and fetch their frames
        for (let i = 0; i < totalStories; i++) {
          const frames = await contract.getStoryFrames(i);
          for (let tokenId of frames) {
            const tokenURI = await contract.tokenURI(tokenId);
            const metadata = await contract.getNFTMetadata(tokenId);
            items.push({
              tokenId: tokenId.toNumber(),
              tokenURI,
              likes: metadata.likes.toNumber(),
              comments: metadata.comments,
            });
          }
        }

        setNfts(items);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchNFTs();
  }, []);

  const likeNFT = async (tokenId: number) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.likeNFT(tokenId);
      await tx.wait();

      // Update the likes count locally
      setNfts((prevNfts) =>
        prevNfts.map((nft) =>
          nft.tokenId === tokenId ? { ...nft, likes: nft.likes + 1 } : nft
        )
      );
    } catch (error) {
      console.error("Error liking NFT:", error);
    }
  };

  const commentNFT = async (tokenId: number, comment: string) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.commentNFT(tokenId, comment);
      await tx.wait();

      // Update the comments locally
      setNfts((prevNfts) =>
        prevNfts.map((nft) =>
          nft.tokenId === tokenId
            ? { ...nft, comments: [...nft.comments, comment] }
            : nft
        )
      );
    } catch (error) {
      console.error("Error commenting on NFT:", error);
    }
  };

  return (
    <div className="p-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Gallery</h1>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {nfts.map((nft, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            {/* Render base64 image */}
            <img
              src={nft.tokenURI} // Base64 string is directly used here
              alt={`NFT ${nft.tokenId}`}
              className="w-full h-64 object-cover rounded cursor-pointer"
              onClick={() => setFullscreenImage(nft.tokenURI)} // Set fullscreen image on click
            />
            <div className="mt-2 flex justify-between">
              <button
                className="bg-blue-500 px-2 py-1 rounded"
                onClick={() => likeNFT(nft.tokenId)}
              >
                Like ({nft.likes})
              </button>
              <input
                type="text"
                className="bg-gray-700 px-2 py-1 rounded text-white"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      commentNFT(nft.tokenId, input.value.trim());
                      input.value = ""; // Clear the input field
                    }
                  }
                }}
              />
            </div>
            <div className="mt-2 text-left text-sm text-gray-400">
              {nft.comments.map((comment, i) => (
                <p key={i}>&#8226; {comment}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)} // Close modal on click
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen NFT"
            className="max-w-full max-h-full rounded"
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
