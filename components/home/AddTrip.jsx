"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";

export default function AddTrip() {
  const [tripData, setTripData] = useState({
    origin: "",
    destination: "",
    date: "",
    price: "",
    pickupTime: "",
    dropoffTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Trip data submitted:", tripData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-lg">
      <CardHeader className="bg-teal-500 text-white rounded-lg">
        <CardTitle className="text-2xl font-bold">Add a New Trip</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                Origin
              </Label>
              <Input
                id="origin"
                name="origin"
                value={tripData.origin}
                onChange={handleInputChange}
                placeholder="Enter origin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                value={tripData.destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={tripData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-teal-500" />
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={tripData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pickupTime" className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-teal-500" />
                Pickup Time
              </Label>
              <Input
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={tripData.pickupTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffTime" className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-teal-500" />
                Drop-off Time
              </Label>
              <Input
                id="dropoffTime"
                name="dropoffTime"
                type="time"
                value={tripData.dropoffTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600"
          >
            Add Trip
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
