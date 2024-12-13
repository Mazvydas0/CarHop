"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import Cookies from "js-cookie";

// Create the context
const XMTPContext = createContext({
  xmtpClient: null,
  isXmtpInitialized: false,
  initializeXmtp: async () => false,
  resetXmtp: () => {},
});

// Context Provider Component
export const XMTPProvider = ({ children }) => {
  const [xmtpClient, setXmtpClient] = useState(null);
  const [isXmtpInitialized, setIsXmtpInitialized] = useState(false);

  // Initialize XMTP client
  const initializeXmtp = useCallback(
    async (providedSigner) => {
      try {
        // If no signer provided, try to get from MetaMask
        let signer = providedSigner;
        if (!signer) {
          if (typeof window.ethereum === "undefined") {
            throw new Error("MetaMask is not installed");
          }

          const provider = new ethers.BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
        }

        // Check if we already have a client
        if (xmtpClient) {
          return true;
        }

        // Create XMTP client
        const client = await Client.create(signer);

        // Set the client and mark as initialized
        setXmtpClient(client);
        setIsXmtpInitialized(true);

        console.log("XMTP client initialized successfully");
        return true;
      } catch (error) {
        console.error("Failed to initialize XMTP:", error);
        setIsXmtpInitialized(false);
        return false;
      }
    },
    [xmtpClient]
  );

  // Reset XMTP client
  const resetXmtp = useCallback(() => {
    setXmtpClient(null);
    setIsXmtpInitialized(false);
  }, []);

  // Attempt to restore XMTP client on mount
  useEffect(() => {
    const restoreXmtpClient = async () => {
      const savedAddress = Cookies.get("walletAddress");
      if (savedAddress) {
        await initializeXmtp();
      }
    };

    restoreXmtpClient();
  }, [initializeXmtp]);

  return (
    <XMTPContext.Provider
      value={{
        xmtpClient,
        isXmtpInitialized,
        initializeXmtp,
        resetXmtp,
      }}
    >
      {children}
    </XMTPContext.Provider>
  );
};

// Custom hook to use XMTP context
export const useXMTP = () => {
  const context = useContext(XMTPContext);
  if (context === undefined) {
    throw new Error("useXMTP must be used within an XMTPProvider");
  }
  return context;
};
