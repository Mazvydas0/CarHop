"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/Button";
import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";
import { upcomingTrips } from "@/utils/upcomingTrips";

const contractABI = [
  "event LogMessage(string message)",
  "function logMessage(string memory _message) public",
  "function getMessageHash(string memory _message) public pure returns (bytes32)",
];

const contractAddress = "0xfecd12253D5546F0FF36c0aA16BBe3997C457FD2";

export default function HomePage() {
  const [logs, setLogs] = useState([]);

  // const fetchLogs = async () => {
  //   try {
  //     const provider = new ethers.JsonRpcProvider(
  //       "https://polygon-amoy.g.alchemy.com/v2/vUYz0ErAPYMDWwowHR30m3aVdnXeZD13"
  //     );

  //     // Create a contract instance
  //     const contract = new ethers.Contract(
  //       contractAddress,
  //       contractABI,
  //       provider
  //     );

  //     // Fetch past events
  //     const filter = contract.filters.LogMessage();
  //     const events = await contract.queryFilter(filter);

  //     // Process and set the logs
  //     const processedLogs = events.map((event) => ({
  //       message: event.args.message,
  //       blockNumber: event.blockNumber,
  //       transactionHash: event.transactionHash,
  //     }));

  //     setLogs(processedLogs);
  //   } catch (error) {
  //     console.error("Error fetching logs:", error);
  //     setLogs([{ message: "Error fetching logs. Check console for details." }]);
  //   }
  // };

  const fetchLogs = async () => {
    await fetch('/api/fetchLogs', {
      method: "GET",
      
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr] pt-4">
        <div>
          <FindForm />
        </div>
        <div>
          <TripList upcomingTrips={upcomingTrips} />
        </div>
      </div>
      <Button variant="secondary" onClick={fetchLogs}>
        Press here to see log
      </Button>
      {logs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Contract Logs:</h2>
          <ul className="list-disc pl-5">
            {logs.map((log, index) => (
              <li key={index} className="mb-2">
                <p>
                  <strong>Message:</strong> {log.message}
                </p>
                {log.blockNumber && (
                  <p>
                    <strong>Block Number:</strong> {log.blockNumber}
                  </p>
                )}
                {log.transactionHash && (
                  <p>
                    <strong>Transaction Hash:</strong>{" "}
                    <a
                      href={`https://amoy.polygonscan.com/address/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {log.transactionHash}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
