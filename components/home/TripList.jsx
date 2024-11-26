"use client";

import Link from "next/link";
import TripCard from "./TripCard";

export default function TripList({ upcomingTrips, headerText, finished }) {
  const currentTime = Date.now();

  // filters trips, based on whether they are finished(or canceled) or not yet done
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
