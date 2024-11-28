"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";

import {
  useEthereumProvider,
  useTripDetails,
  useTripPassengers,
  useTripActions,
} from "@/hooks/useTripDetails";

import { useTripRatings } from "@/hooks/useTripRatings";
import DriverCard from "@/components/home/trip details/DriverCard";
import TripActionButtons from "@/components/home/trip details/TripActionButtons";
import PassengersList from "@/components/home/trip details/PassengerList";
import TripInformation from "@/components/home/trip details/TripInformation";

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

  const { ratings, ratingStatus, handleRatingChange, rateParticipants } =
    useTripRatings(provider, tripId, trip);

  const togglePassengersList = () => {
    setShowPassengers(!showPassengers);
  };

  const handleBatchRatingSubmission = () => {
    const ratingsToSubmit = Object.entries(ratings)
      .filter(([, value]) => value)
      .map(([address, rating]) => ({ address, rating: parseInt(rating, 10) }));

    if (ratingsToSubmit.length > 0) {
      rateParticipants(ratingsToSubmit);
    }
  };

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
            {trip.completed ? (
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
          <TripInformation
            pickupLocation={trip?.pickupLocation || "N/A"}
            dropoffLocation={trip?.dropoffLocation || "N/A"}
            pickupTime={trip?.pickupTime || "N/A"}
            dropoffTime={trip?.dropoffTime || "N/A"}
            price={trip?.price || "N/A"}
          />

          <DriverCard
            driver={trip.driver}
            driverAverageRating={trip.driverAverageRating}
            driverRatingCount={trip.driverRatingCount}
          />
          <PassengersList
            driver={trip.driver}
            passengers={passengers}
            loadingPassengers={loadingPassengers}
            availableSeats={trip.availableSeats}
            ratings={ratings}
            handleRatingChange={handleRatingChange}
            handleBatchRatingSubmission={handleBatchRatingSubmission}
            ratingStatus={ratingStatus}
            togglePassengersList={togglePassengersList}
            showPassengers={showPassengers}
          />
          <TripActionButtons
            showCompleteButton={showCompleteButton}
            trip={trip}
            bookingStatus={bookingStatus}
            completeStatus={completeStatus}
            handleBookTrip={handleBookTrip}
            handleCompleteTrip={handleCompleteTrip}
            handleCancelTrip={handleCancelTrip}
            handleCancelBooking={handleCancelBooking}
            rescheduleData={rescheduleData}
            setRescheduleData={setRescheduleData}
            handleRescheduleTrip={handleRescheduleTrip}
          />
        </CardContent>
      </Card>
    </div>
  );
}
