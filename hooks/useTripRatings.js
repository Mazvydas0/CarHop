import { useState } from "react";
import { ethers } from "ethers";
import { tripContractAbi } from "@/lib/TripContractAbi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
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

  const ratePassengers = async (ratingsToSubmit) => {
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
        const driverTx = await tripContract.rateDriver(
          tripId,
          driverRating.rating
        );
        await driverTx.wait();
      }

      // Rate passengers if any passenger ratings exist
      if (passengerRatings.length > 0) {
        const passengerAddresses = passengerRatings.map((r) => r.address);
        const passengerRatingValues = passengerRatings.map((r) => r.rating);

        const passengerTx = await tripContract.ratePassengers(
          tripId,
          passengerAddresses,
          passengerRatingValues
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
    ratePassengers,
  };
};
