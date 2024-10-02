"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import Image from "next/image";

export default function TripCard({ trip }) {
  return (
    <Card key={trip.id} className="overflow-hidden my-1 hover:border-teal-300 hover:border-2 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/ProfilePic.jpg"
              alt={trip.driver}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{trip.driver}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">{trip.rating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              <Calendar className="mr-1 inline-block h-4 w-4" />
              {trip.date}
            </div>
            <div className="text-lg font-bold text-teal-600">${trip.price}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 w-1/2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="truncate">{trip.origin}</span>
          </div>
          <div className="flex items-center justify-center w-1/12">
            <ArrowRight className="h-5 w-5 text-teal-500" />
          </div>
          <div className="flex items-center space-x-2 w-1/2 justify-end">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="truncate">{trip.destination}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
