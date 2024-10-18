import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import  Cookies  from "js-cookie";
import { useRouter } from "next/navigation";

export const useMetaMaskWallet = () => {
  const { sdk, connected, connecting } = useSDK();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const router = useRouter()

  // handle account changes from sdk
  useEffect(() => {
    const savedAddress = Cookies.get("walletAddress");
    if (savedAddress) setCurrentAccount(savedAddress);

    if (typeof window.ethereum !== "undefined")
      window.ethereum.on("accountsChanged", handleAccountChange);

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  const handleAccountChange = (accounts) => {
    if (accounts[0]) {
      setCurrentAccount(accounts?.[0]);
      Cookies.set("walletAddress", accounts[0]);
    } else {
      setCurrentAccount(null);
      Cookies.remove("walletAddress");
    }
  };

  const connect = async () => {
    try {
      setShowBubble(true);
      const accounts = await sdk?.connect();
      if (accounts?.[0]) {
        handleAccountChange(accounts);
        router.push("/home")
      }
    } catch (err) {
      console.warn(`Failed to connect:`, err);
    } finally {
      setTimeout(() => setShowBubble(false), 3000);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
      setCurrentAccount(null);
      Cookies.remove("walletAddress");
      router.push("/");
    }
  };

  return {
    connect,
    disconnect,
    currentAccount,
    connected,
    connecting,
    showBubble,
  };
};
