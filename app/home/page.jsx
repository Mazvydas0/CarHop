"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";
import { fetchAllTrips } from "@/utils/tripContractMethods";

export default function HomePage() {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    const getAllTrips = async () => {
      if (!provider) return; 

      try {
        const trips = await fetchAllTrips(provider);
        console.log("All trips fetched: ", trips);
        setUpcomingTrips(trips);
      } catch (err) {
        console.error("Error fetching trips: ", err);
      }
    };

    getAllTrips();
  }, [provider]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr] pt-4">
        <div>
          <FindForm />
        </div>
        <div>
          <div>
            <TripList upcomingTrips={upcomingTrips} headerText="Past Trips" finished={true} />
          </div>
          <div>
            <TripList
              upcomingTrips={upcomingTrips}
              headerText="Upcoming Trips"
              finished={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
