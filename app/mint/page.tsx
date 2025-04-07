"use client";
// MintPage.js
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import contractData from "../contractABI.json";
const abi = contractData.abi;

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { ethers } from "ethers";
import { GoogleGenAI } from "@google/genai";

// Firebase configuration
const firebaseConfig = {
  apiKey: "<your_config>",
  authDomain: "test-56046.firebaseapp.com",
  projectId: "test-56046",
  storageBucket: "test-56046.appspot.com",
  messagingSenderId: "872381887393",
  appId: "1:872381887393:web:4cbe74af738bd35983d1e0",
  measurementId: "G-07MN29TMGP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const MintPage = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null); // Store the generated image as a Blob
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Store the preview URL
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      const ai = new GoogleGenAI({
        apiKey: "<your_api_key>",
      });

      //       const contents = `Generate a short 6 image story inspired by the following user prompt, and imagine it being illustrated with scenes in the style of Studio Ghibli. Focus on creating a narrative that evokes the whimsical, heartwarming, and often nature-filled atmosphere of Ghibli films.

      // User Prompt: ${prompt}`;

      const contents = `Generate a six-panel storyboard in the style of Studio Ghibli, aiming for high-quality, photorealistic imagery within the Ghibli aesthetic, based on the following user prompt:

${prompt}

Create a single image containing six distinct panels, arranged to tell a sequential story. Each panel should evoke the characteristic Ghibli aesthetic, emphasizing:

* **Highly detailed, photorealistic environments:** Focus on natural settings, realistic architecture, and vibrant, lifelike colors, pushing the boundaries of Ghibli's style towards photorealism while retaining its core aesthetic.
* **Expressive, lifelike characters:** Capture a sense of wonder, innocence, and emotional depth with a focus on realistic proportions and subtle expressions.
* **A sense of cinematic storytelling:** Suggest a journey, a discovery, or a moment of quiet magic, utilizing cinematic framing and composition.
* **Soft, painterly rendering with enhanced realism:** Aim for a style that blends the hand-drawn feel of Ghibli with a high level of photorealistic detail, achieving a seamless fusion.
* **Clear panel divisions:** Ensure each of the six panels are clearly defined within the single output image.

The panels should flow sequentially, telling a clear and engaging story. Avoid comical elements and prioritize high-quality, photorealistic Ghibli-style imagery.

Output a single image containing the six panels. Do not provide separate image descriptions.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: contents,
        config: {
          responseModalities: ["Text", "Image"],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (imageData) {
            const buffer = Buffer.from(imageData, "base64");
            const blob = new Blob([buffer], { type: "image/png" });
            setImageBlob(blob); // Store the Blob for later upload
            const previewURL = URL.createObjectURL(blob); // Create a preview URL
            setImagePreview(previewURL);
            console.log("Image generated and previewed.");
          } else {
            console.error("Image data is undefined");
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!imageBlob) {
      alert("Please generate an image before minting.");
      return;
    }

    if (!title) {
      alert("Please enter a title for the NFT.");
      return;
    }

    try {
      setLoading(true);

      // Request account access
      if (!window.ethereum) {
        alert(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log("Connected account:", account);

      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}.png`);
      await uploadBytes(storageRef, imageBlob);
      const imageURL = await getDownloadURL(storageRef);
      console.log("Image uploaded to Firebase:", imageURL);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Replace with your contract address and ABI
      const contract = new ethers.Contract(
        // "0x21321036Dc1238411840F86F253F923B11f89AEb",
        "0x9D4e333174A90fDd4F8f419e5183592a488A2dbA",
        abi,
        signer
      );

      console.log("Creating story...");
      const createStoryTx = await contract.createStory(title); // Pass the title to the contract
      const createStoryReceipt = await createStoryTx.wait();

      // Extract the storyId from the event logs
      const storyId = createStoryReceipt.events[0].args.storyId.toNumber();
      console.log("Story created with ID:", storyId);

      console.log("Minting NFT...");
      const mintTx = await contract.mintFrame(storyId, imageURL); // Pass the Firebase URL as tokenURI
      await mintTx.wait();

      alert("NFT minted successfully!");
      console.log("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Mint a Ghibli NFT</h1>
      <input
        className="border p-2 w-full mt-4 bg-gray-800 text-white"
        placeholder="Enter a title for the NFT"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mt-4 bg-gray-800 text-white"
        placeholder="Enter a scene description"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2"
        onClick={generateImage}
        disabled={loading}
      >
        {loading ? "Generating Image..." : "Generate Image"}
      </button>
      {imagePreview && (
        <img
          src={imagePreview}
          className="mt-4 w-full"
          alt="Generated Preview"
        />
      )}
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2"
        onClick={mintNFT}
        disabled={loading}
      >
        {loading ? "Minting NFT..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default MintPage;
