"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import RescheduleDialog from "@/components/home/RescheduleDialog";

import {
  useEthereumProvider,
  useTripDetails,
  useTripPassengers,
  useTripActions,
} from "@/hooks/useTripDetails";

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const provider = useEthereumProvider();
  const { trip, loading, error, showCompleteButton, setTrip } = useTripDetails(
    provider,
    tripId
  );
  const [showPassengers, setShowPassengers] = useState(false);
  const { passengers, loadingPassengers } = useTripPassengers(
    provider,
    tripId,
    showPassengers
  );
  const [rescheduleData, setRescheduleData] = useState({
    pickupTime: "",
    dropoffTime: "",
  });

  const {
    handleBookTrip,
    handleCompleteTrip,
    handleCancelTrip,
    handleCancelBooking,
    handleRescheduleTrip,
    bookingStatus,
    completeStatus,
  } = useTripActions(provider, tripId, trip);

  const togglePassengersList = () => {
    setShowPassengers(!showPassengers);
  };

  const stars = Array.from({ length: 5 }, (_, index) => index);

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

  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-teal-500 text-white">
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            <span>Trip Details</span>
            {trip.completed || trip.cancelled ? (
              <div className="flex items-center space-x-2 bg-white text-teal-500 px-3 py-1 rounded-full text-sm">
                {trip.completed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Cancelled</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-white text-teal-500 px-3 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                <span>Active</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-teal-500" />
              <span className="text-lg font-semibold">
                {trip?.pickupLocation || "N/A"}
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-teal-500" />
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-teal-500" />
              <span className="text-lg font-semibold">
                {trip?.dropoffLocation || "N/A"}
              </span>
            </div>
          </div>

          <div className="mb-8 flex justify-between gap-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-semibold">Pickup:</span>
              <span>
                {trip?.pickupTime
                  ? trip?.pickupTime.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-semibold">Dropoff:</span>
              <span>
                {trip?.dropoffTime
                  ? trip?.dropoffTime.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <span className="text-3xl font-bold text-teal-600">
              {trip?.price} ETH
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
                    {trip?.driver || "Driver Name"}
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

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-teal-500" />
                <span className="font-semibold">Available Seats:</span>
                <span>{trip?.availableSeats || "N/A"}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePassengersList}
                className="text-teal-500 border-teal-500 hover:bg-teal-50"
              >
                {showPassengers ? "Hide Passengers" : "Show Passengers"}
              </Button>
            </div>
            {showPassengers && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold mb-2">Booked Passengers:</h4>
                {loadingPassengers ? (
                  <p className="text-sm text-gray-500">Loading passengers...</p>
                ) : passengers.length > 0 ? (
                  <ul className="space-y-2">
                    {passengers.map((passenger, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-teal-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {`${passenger.address.slice(
                              0,
                              6
                            )}...${passenger.address.slice(-4)}`}
                          </span>
                        </div>
                        {passenger.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {passenger.rating}/5
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No passengers booked yet.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            {bookingStatus.error && (
              <p className="text-red-500 mb-2">{bookingStatus.error}</p>
            )}
            <div className="flex flex-col items-center">
              <div id="trip-booking">
                <Button
                  className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
                  size="lg"
                  onClick={handleBookTrip}
                  disabled={
                    showCompleteButton || trip.completed || trip.cancelled
                  }
                >
                  {bookingStatus.loading ? "Booking..." : "Book This Ride"}
                </Button>
                {showCompleteButton && !trip.completed && !trip.cancelled && (
                  <div className="mt-4">
                    {completeStatus.error && (
                      <p className="text-red-500 mb-2">
                        {completeStatus.error}
                      </p>
                    )}
                    <Button
                      className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
                      size="lg"
                      onClick={handleCompleteTrip}
                      disabled={completeStatus.loading || !trip.isPaid}
                    >
                      {completeStatus.loading
                        ? "Completing..."
                        : "Complete Trip"}
                    </Button>
                    {!trip.isPaid && (
                      <p className="text-sm text-gray-500 mt-2">
                        Trip must be paid for before it can be completed
                      </p>
                    )}
                  </div>
                )}
              </div>
              {!trip.completed && !trip.cancelled && (
                <div id="trip-modifying" className="mt-4 space-x-4">
                  <Button
                    variant="destructive"
                    className="w-48 max-w-md"
                    onClick={handleCancelTrip}
                  >
                    Cancel Trip
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-48 max-w-md"
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>

            <RescheduleDialog
              rescheduleData={rescheduleData}
              setRescheduleData={setRescheduleData}
              handleRescheduleTrip={handleRescheduleTrip}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
