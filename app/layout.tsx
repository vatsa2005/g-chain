"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <nav className="bg-gray-800 p-4 flex justify-around items-center text-white">
          <Link href="/">Home</Link>
          <Link href="/mint">Mint</Link>
          <Link href="/browse">Gallery</Link>
          <Link href="/about">About</Link>
          <button
            onClick={connectWallet}
            className="bg-blue-500 px-4 py-2 rounded text-white"
          >
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </nav>
        {/* <Navbar /> */}
        {children}
        {/* Footer */}
        <footer className="flex w-full justify-center items-center bg-gray-800/30 backdrop-blur-sm py-16 mt-20 border-t border-purple-500/10">
          <div className="container px-4 w-full">
            <div className="grid md:grid-cols-4 gap-12 w-full">
              <div className="w-full">
                <h3 className="text-2xl font-display font-bold mb-4">
                  StoryWeave
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Where imagination meets AI to create magical visual stories in
                  the beloved Studio Ghibli style.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
