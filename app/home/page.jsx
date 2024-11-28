import React from "react";
import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr] pt-4">
        <div>
          <FindForm />
        </div>
        <div>
          <div>
            <TripList
              headerText="Past Trips"
              finished={true}
            />
          </div>
          <div>
            <TripList
              headerText="Upcoming Trips"
              finished={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
