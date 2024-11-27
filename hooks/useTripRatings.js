import { useState } from "react";
import { ethers } from "ethers";
import { tripContractAbi } from "@/lib/TripContractAbi";

const CONTRACT_ADDRESS = "0xE02EE6a7742c4cfd3b21d0865459AA81060E078b";
const CONTRACT_ABI = tripContractAbi;

export const useTripRatings = (provider, tripId, trip) => {
  const [ratings, setRatings] = useState({});
  const [ratingStatus, setRatingStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleRatingChange = (address, value) => {
    setRatings((prev) => ({ ...prev, [address]: value }));
  };

  const submitDriverRating = async () => {
    if (!provider || !tripId) {
      setRatingStatus({
        loading: false,
        error: "Provider or Trip ID missing",
        success: false,
      });
      return;
    }

    try {
      setRatingStatus({ loading: true, error: null, success: false });
      const signer = provider.getSigner();
      const tripContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const driverRating = ratings[trip.driver];
      if (!driverRating || driverRating < 1 || driverRating > 5) {
        throw new Error("Invalid rating. Must be between 1 and 5.");
      }

      const tx = await tripContract.rateDriver(tripId, driverRating);
      await tx.wait();

      setRatingStatus({ loading: false, error: null, success: true });
      alert("Driver rated successfully!");
    } catch (error) {
      setRatingStatus({
        loading: false,
        error: error.message || "Failed to submit driver rating",
        success: false,
      });
      alert(error.message || "Failed to rate driver");
      console.error("Driver rating error:", error);
    }
  };

  const submitPassengerRatings = async () => {
    if (!provider || !tripId) {
      setRatingStatus({
        loading: false,
        error: "Provider or Trip ID missing",
        success: false,
      });
      return;
    }

    try {
      setRatingStatus({ loading: true, error: null, success: false });
      const signer = provider.getSigner();
      const tripContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const passengerAddresses = Object.keys(ratings);
      const passengerRatings = passengerAddresses.map(
        (address) => ratings[address]
      );

      if (passengerRatings.some((rating) => rating < 1 || rating > 5)) {
        throw new Error("Invalid rating. All ratings must be between 1 and 5.");
      }

      const tx = await tripContract.ratePassengers(
        tripId,
        passengerAddresses,
        passengerRatings
      );
      await tx.wait();

      setRatingStatus({ loading: false, error: null, success: true });
      alert("Passenger ratings submitted successfully!");
    } catch (error) {
      setRatingStatus({
        loading: false,
        error: error.message || "Failed to submit passenger ratings",
        success: false,
      });
      alert(error.message || "Failed to submit passenger ratings");
      console.error("Passenger ratings error:", error);
    }
  };

  return {
    ratings,
    ratingStatus,
    handleRatingChange,
    submitDriverRating,
    submitPassengerRatings,
  };
};
