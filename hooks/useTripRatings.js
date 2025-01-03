import { useState } from "react";
import { ethers } from "ethers";
import { ratingContractAbi } from "@/lib/RatingContractAbi";

const RATING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_RATING_CONTRACT_ADDRESS;
const CONTRACT_ABI = ratingContractAbi;

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

  const rateParticipants = async (ratingsToSubmit) => {
    if (!provider || !tripId) {
      setRatingStatus({
        loading: false,
        error: "Provider or Trip ID missing",
        success: false,
      });
      return;
    }

    // Check if the trip is completed
    if (!trip?.completed) {
      alert("Ratings cannot be submitted for a non completed trip.");
      setRatingStatus({
        loading: false,
        error: "Trip is not yet completed",
        success: false,
      });
      return;
    }

    try {
      setRatingStatus({ loading: true, error: null, success: false });
      const signer = await provider.getSigner();
      const ratingContract = new ethers.Contract(
        RATING_CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Validate ratings
      if (
        ratingsToSubmit.some((rating) => rating.rating < 1 || rating.rating > 5)
      ) {
        throw new Error("Invalid rating. All ratings must be between 1 and 5.");
      }

      // Separate driver and passenger ratings
      const driverRating = ratingsToSubmit.find(
        (r) => r.address === trip.driver
      );
      const passengerRatings = ratingsToSubmit.filter(
        (r) => r.address !== trip.driver
      );

      // Rate driver if a driver rating exists
      if (driverRating) {
        const driverTx = await ratingContract.rateDriver(
          tripId,
          trip.driver,
          driverRating.rating,
          signer.getAddress()
        );
        await driverTx.wait();
      }

      for (const passengerRating of passengerRatings) {
        const passengerTx = await ratingContract.ratePassenger(
          tripId,
          passengerRating.address,
          passengerRating.rating,
          trip.driver
        );
        await passengerTx.wait();
      }

      setRatingStatus({ loading: false, error: null, success: true });
      alert("Ratings submitted successfully!");
    } catch (error) {
      setRatingStatus({
        loading: false,
        error: error.message || "Failed to submit ratings",
        success: false,
      });
      alert(error.message || "Failed to submit ratings");
      console.error("Ratings submission error:", error);
    }
  };

  return {
    ratings,
    ratingStatus,
    handleRatingChange,
    rateParticipants,
  };
};
