'use client'
import React, { useState } from "react";
import FindForm from "@/components/home/FindForm";
import TripList from "@/components/home/TripList";

export default function HomePage() {
  const [filters, setFilters] = useState({});

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr] pt-4">
        <div>
          <FindForm onFilter={handleFilter} />
        </div>
        <div>
          <div>
            <TripList
              headerText="Completed Trips"
              finished={true}
              filters={filters}
            />
          </div>
          <div>
            <TripList
              headerText="Upcoming Trips"
              finished={false}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
