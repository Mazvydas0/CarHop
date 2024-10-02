"use client";

import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";
import { upcomingTrips } from "@/utils/upcomingTrips";
export default function HomePage() {
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
    </div>
  );
}
