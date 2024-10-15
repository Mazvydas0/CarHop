"use client";

import SvgMetamask from "./SvgMetamask";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Modal bubble component for "Check MetaMask extension"
const BubbleMessage = ({ message }) => {
  return (
    <div className="absolute mt-2 w-38 bg-blue-100 text-blue-800 text-sm px-3 py-2 border border-blue-300 rounded-lg shadow-md z-20">
      {message}
    </div>
  );
};

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();
  const [showBubble, setShowBubble] = useState(false);

  const connect = async () => {
    try {
      setShowBubble(true); // Show the bubble message when trying to connect
      await sdk?.connect();
      setTimeout(() => setShowBubble(false), 3000); // Hide the bubble after 3 seconds
    } catch (err) {
      console.warn(`No accounts found`, err);
      setShowBubble(false); // Hide bubble if there is an error
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {connected && account ? (
        <Popover>
          <PopoverTrigger>
            <Button variant="secondary">{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="relative">
          <Button variant="secondary" disabled={connecting} onClick={connect}>
            <SvgMetamask className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
          {showBubble && <BubbleMessage message="Check MetaMask extension" />}
        </div>
      )}
    </div>
  );
};

export const MetaButton = () => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "CarHop",
      url: "host", // using the host constant defined above
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <ConnectWalletButton />
    </MetaMaskProvider>
  );
};

export default MetaButton;
