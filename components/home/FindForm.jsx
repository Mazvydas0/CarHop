"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function FindForm({ onFilter }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const handleSearch = () => {
    if (time && !date) {
      setShowTimeWarning(true);
      return;
    }
    setShowTimeWarning(false);
    onFilter({ origin, destination, date, time });
  };

  const handleReset = () => {
    setOrigin("");
    setDestination("");
    setDate("");
    setTime("");
    setShowTimeWarning(false);
    onFilter({});
  };

  return (
    <Card className="p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-teal-600">
          Find a Ride
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="Enter origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  onFocus={() => setShowTimeWarning(false)}
                />
                {showTimeWarning && (
                  <div className="absolute -top-6 left-0 bg-red-100 text-red-500 text-sm px-2 py-1 rounded shadow-lg">
                    Please select a date when entering a time.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={handleSearch}
              className="bg-teal-500 hover:bg-teal-600 w-[45%]"
            >
              Search Rides
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-[45%]"
              onClick={handleReset}
            >
              Remove Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
