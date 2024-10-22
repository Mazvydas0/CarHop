"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";
import { upcomingTrips } from "@/utils/upcomingTrips";
import { fetchLogs } from "@/lib/utils";

export default function HomePage() {
  const [logs, setLogs] = useState([]);

  const contractAddress = "0xfecd12253D5546F0FF36c0aA16BBe3997C457FD2";
  const handleFetch = async () => {
    try {
      const fetchedLogs = await fetchLogs();
      setLogs(fetchedLogs);
    } catch (err) {
      console.log(err);
    }
  };

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
      <Button variant="secondary" onClick={handleFetch}>
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
