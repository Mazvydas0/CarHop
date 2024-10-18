import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ethers } from "ethers";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatBalance = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr) => {
  return `${addr?.substring(0, 8)}...`;
};

// Smart contract fetch from polygonscan

export const fetchLogs = async () => {
  const contractABI = [
    "event LogMessage(string message)",
    "function logMessage(string memory _message) public",
    "function getMessageHash(string memory _message) public pure returns (bytes32)",
  ];
  
  const contractAddress = "0xfecd12253D5546F0FF36c0aA16BBe3997C457FD2";
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://polygon-amoy.g.alchemy.com/v2/vUYz0ErAPYMDWwowHR30m3aVdnXeZD13"
    );

    // Create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Fetch past events
    const filter = contract.filters.LogMessage();
    const events = await contract.queryFilter(filter);

    // Process and set the logs
    const processedLogs = events.map((event) => ({
      message: event.args.message,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    }));

    return processedLogs;
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};
