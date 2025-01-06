import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchAllTrips } from "@/utils/tripContractMethods";
import Link from "next/link";
import TripCard from "./TripCard";

export default function TripList({ headerText, finished, filters }) {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
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
        applyFilters(trips);
      } catch (err) {
        console.error("Error fetching trips: ", err);
      }
    };

    getAllTrips();
  }, [provider]);

  useEffect(() => {
    applyFilters(upcomingTrips);
  }, [upcomingTrips, filters]);

  const applyFilters = (trips) => {
    const filtered = trips.filter((trip) => {
      const tripPickupDate = trip.pickupTime; // Already a Date object
      const tripPickupDateString = tripPickupDate.toISOString().slice(0, 10); // YYYY-MM-DD

      // Extract hours and minutes from pickup time
      const tripHours = tripPickupDate.getHours();
      const tripMinutes = tripPickupDate.getMinutes();
      const tripTotalMinutes = tripHours * 60 + tripMinutes; // Total minutes since midnight

      let isFiltered = finished
        ? tripPickupDate.getTime() <= Date.now() || trip.completed
        : tripPickupDate.getTime() > Date.now() && !trip.completed;

      if (
        filters.origin &&
        !trip.pickupLocation
          .toLowerCase()
          .includes(filters.origin.toLowerCase())
      ) {
        isFiltered = false;
      }

      if (
        filters.destination &&
        !trip.dropoffLocation
          .toLowerCase()
          .includes(filters.destination.toLowerCase())
      ) {
        isFiltered = false;
      }

      // Filter by date and time
      if (filters.date) {
        // Use midnight if no time is specified
        const filterTime = filters.time || "00:00"; // Default to midnight
        const filterDate = new Date(`${filters.date}T${filterTime}:00`);

        if (tripPickupDate < filterDate) {
          isFiltered = false; // Exclude trips happening before the filter date/time
        }
      }

      return isFiltered;
    });

    console.log("Filtered Trips:", filtered);
    setFilteredTrips(filtered);
  };





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
