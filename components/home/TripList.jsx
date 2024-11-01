"use client";

import Link from "next/link";
import TripCard from "./TripCard";

export default function TripList({ upcomingTrips }) {
  return (
    <div>
      <h2 className="text-2xl pb-4 font-semibold text-teal-600">Upcoming Trips</h2>
      {upcomingTrips.map((trip) => (
        <Link key={trip.tripId} href={`/home/trip/${trip.tripId}`}>
          <TripCard trip={trip} />
        </Link>
      ))}
    </div>
  );
}
