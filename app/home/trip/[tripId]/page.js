"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";
import { upcomingTrips } from "@/utils/upcomingTrips";
import { useParams } from "next/navigation";


export default function TripDetails() {
    const id = useParams().tripId
    const trip = upcomingTrips.find((trip) => trip.id === +id)
    return (
      <div className="container mx-auto p-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-teal-500 text-white">
            <CardTitle className="text-2xl font-bold">Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-teal-500" />
                <span className="text-lg font-semibold">{trip.origin}</span>
              </div>
              <ArrowRight className="h-6 w-6 text-teal-500" />
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-teal-500" />
                <span className="text-lg font-semibold">
                  {trip.destination}
                </span>
              </div>
            </div>

            <div className="mb-8 flex justify-between gap-4">
              <div className="flex items-center  space-x-2 mb-2">
                <Clock className="h-5 w-5 text-teal-500" />
                <span className="font-semibold">Pickup:</span>
                <span>
                  {new Date(trip.datePickup).toLocaleDateString("en-US")} at{" "}
                  {trip.pickupTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal-500" />
                <span className="font-semibold">Dropoff:</span>
                <span>
                  {new Date(trip.dateDropoff).toLocaleDateString("en-US")} at{" "}
                  {trip.dropoffTime}
                </span>
              </div>
            </div>

            <div className="mb-8 text-center">
              <span className="text-3xl font-bold text-teal-600">
                ${trip.price}
              </span>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                  <Image
                    src={trip.driverImage}
                    alt={trip.driverName}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">{trip.driverName}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(trip.driverRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2">{trip.driverRating}</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {trip.carYear} {trip.carModel}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
                size="lg"
              >
                Book This Ride
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
