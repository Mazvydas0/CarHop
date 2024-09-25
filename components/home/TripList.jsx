"use client";

import TripCard from "./TripCard";

export default function TripList({ upcomingTrips }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-teal-600">Upcoming Trips</h2>
      {upcomingTrips.map((trip) => (
        <TripCard trip={trip} />
      ))}
    </div>
  );
}
