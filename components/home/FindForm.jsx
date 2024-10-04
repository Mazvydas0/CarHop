"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

export default function FindForm() {
  return (
    <Card className="p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-teal-600">
          Find a Ride
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input id="origin" placeholder="Enter origin" />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" placeholder="Enter destination" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input id="date" type="date" />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Input id="time" type="time" />
                <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 w-[45%]"
            >
              Search Rides
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-[45%]"
            >
              Remove Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
