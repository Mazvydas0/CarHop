import { ethers } from "ethers";
import { NextResponse } from "next/server";

const contractABI = [
  "event LogMessage(string message)",
  "function logMessage(string memory _message) public",
  "function getMessageHash(string memory _message) public pure returns (bytes32)",
];

const contractAddress = "0xfecd12253D5546F0FF36c0aA16BBe3997C457FD2";

export async function GET(request) {
  try {
    // Initialize provider using Alchemy RPC URL from environment variables
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

    // Create contract instance
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Set up filter for LogMessage events
    const filter = contract.filters.LogMessage();

    // Query for past events based on the filter
    const events = await contract.queryFilter(filter);

    // Process logs into a structured format
    const processedLogs = events.map((event) => ({
      message: event.args.message,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    }));

    // Respond with processed logs as JSON
    return new Response({logs: processedLogs})
  } catch (error) {
    console.error("Error fetching logs:", error);
    return new Response( {message: "Error fetching logs"} )
   
  }
}
