"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { fetchOneTrip, bookTrip } from "@/utils/tripContractMethods";


export default function TripDetailsPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({
    loading: false,
    error: null,
  });

  // Initialize provider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!provider || !tripId) return;

      try {
        const tripDetails = await fetchOneTrip(provider, tripId);
        setTrip(tripDetails);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch trip details: ", err);
        setError(err.message || "Failed to fetch trip details");
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [provider, tripId]);

  const handleBookTrip = async () => {
    if (!trip || !tripId || !provider) {
      setBookingStatus({ 
        loading: false, 
        error: "Trip details or provider not available" 
      });
      return;
    }

    setBookingStatus({ loading: true, error: null });

    try {
      console.log("Trip details before booking:", {
        tripId,
        price: trip.price,
        provider: provider ? "Available" : "Not available",
      });

      const result = await bookTrip(provider, tripId, trip.price);
      console.log("Trip booked successfully:", result);
      setBookingStatus({ loading: false, error: null });
      alert("Trip booked successfully!");
    } catch (error) {
      console.error("Failed to book trip:", error);
      setBookingStatus({
        loading: false,
        error: error.message || "Failed to book trip",
      });
    }
  };

  // could use next js loading and error files instead
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No trip details found</p>
      </div>
    );
  }

  const stars = Array.from({ length: 5 }, (_, index) => index);

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
              <span className="text-lg font-semibold">
                {trip.pickupLocation || "N/A"}
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-teal-500" />
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-teal-500" />
              <span className="text-lg font-semibold">
                {trip.dropoffLocation || "N/A"}
              </span>
            </div>
          </div>

          <div className="mb-8 flex justify-between gap-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-semibold">Pickup:</span>
              <span>
                {trip.pickupTimestamp
                  ? new Date(
                      Number(trip.pickupTimestamp) * 1000
                    ).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-semibold">Dropoff:</span>
              <span>
                {trip.dropoffTimestamp
                  ? new Date(
                      Number(trip.dropoffTimestamp) * 1000
                    ).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <span className="text-3xl font-bold text-teal-600">
              {trip.price} ETH
            </span>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                <Image
                  src="/images/noProfile.png"
                  alt="Driver"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {trip.driver || "Driver Name"}
                  </h3>
                  <div className="flex items-center">
                    {stars.map((index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < 5
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-2">5.0</span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    Vehicle details placeholder
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
            {bookingStatus.error && (
              <p className="text-red-500 mb-2">{bookingStatus.error}</p>
            )}
            <Button
              className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
              size="lg"
              onClick={handleBookTrip}
              disabled={bookingStatus.loading || !trip}
            >
              {bookingStatus.loading ? "Booking..." : "Book This Ride"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
