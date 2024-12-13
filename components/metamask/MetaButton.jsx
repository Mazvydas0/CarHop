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
    connected,
    connecting,
    showBubble,
    xmtpClient,
  } = useMetaMaskWallet();

  return (
    <div className="relative">
      {connected && currentAccount ? (
        <Popover>
          <PopoverTrigger>
            <Button variant="secondary">{formatAddress(currentAccount)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <Button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
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
