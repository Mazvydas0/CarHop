"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchAllTrips } from "@/utils/tripContractMethods";
import Link from "next/link";
import TripCard from "./TripCard";

export default function TripList({ headerText, finished }) {
  const currentTime = Date.now();
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

  const filteredTrips = upcomingTrips.filter((trip) => {
    const dropoffTimeMillis = Date.parse(trip.dropoffTime);
    return finished
      ? dropoffTimeMillis <= currentTime || trip.completed
      : dropoffTimeMillis > currentTime && !trip.completed;
  });

  console.log("Filtered trips:", filteredTrips);

  return (
    <div>
      <h2 className="text-2xl pb-4 font-semibold text-teal-600">
        {headerText}
      </h2>
      <div className="overflow-y-auto" style={{ maxHeight: "35vh" }}>
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <Link key={trip.tripId} href={`/home/trip/${trip.tripId}`}>
              <TripCard trip={trip} />
            </Link>
          ))
        ) : (
          <p>No trips available or they are being fetched</p>
        )}
      </div>
    </div>
  );
}
