"use client";

import SvgMetamask from "./SvgMetamask";
import { Button } from "../ui/Button";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../utils/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMetaMaskWallet } from "@/hooks/useMetaMaskWallet";

// Modal bubble component for "Check MetaMask extension"
const BubbleMessage = ({ message }) => {
  return (
    <div className="absolute mt-2 w-38 bg-blue-100 text-blue-800 text-sm px-3 py-2 border border-blue-300 rounded-lg shadow-md z-20">
      {message}
    </div>
  );
};

export const ConnectWalletButton = () => {
  const {
    connect,
    disconnect,
    currentAccount,
    connecting,
    showBubble,
    xmtpClient,
  } = useMetaMaskWallet();

  return (
    <div className="relative">
      {currentAccount ? (
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <Button variant="secondary">
                {formatAddress(currentAccount)}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-5 z-10 top-[14px] relative">
            <div className="absolute -top-2 right-12 w-4 h-4 bg-gray-100 border-t border-l border-gray-300 transform rotate-45"></div>
            <Button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-center font-bold text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </Button>
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
      {xmtpClient && <p className="text-green-500">XMTP Connected</p>}
    </div>
  );
};

export const MetaButton = () => {
  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "CarHop",
      url: "host",
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <ConnectWalletButton />
    </MetaMaskProvider>
  );
};

export default MetaButton;
