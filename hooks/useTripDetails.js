import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  fetchOneTrip,
  fetchTripPassengers,
  bookTrip,
  completeTrip,
  rescheduleTrip,
  cancelTrip,
  cancelBooking,
} from "@/utils/tripContractMethods";

// Hook for managing Ethereum provider
export const useEthereumProvider = () => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  return provider;
};

// Hook for fetching trip details
export const useTripDetails = (provider, tripId) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!provider || !tripId) return;

      try {
        const tripDetails = await fetchOneTrip(provider, tripId);
        setTrip(tripDetails);
        setLoading(false);

        const currentTime = Date.now();
        const dropoffTime = Date.parse(tripDetails.dropoffTime);
        setShowCompleteButton(currentTime >= dropoffTime);
      } catch (err) {
        console.error("Failed to fetch trip details: ", err);
        setError(err.reason || "Failed to fetch trip details");
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [provider, tripId]);

  return { trip, loading, error, showCompleteButton, setTrip };
};

// Hook for managing passengers
export const useTripPassengers = (provider, tripId, showPassengers) => {
  const [passengers, setPassengers] = useState([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);

  useEffect(() => {
    const getPassengers = async () => {
      if  (!provider || !tripId) return;

      setLoadingPassengers(true);
      try {
        const passengersData = await fetchTripPassengers(provider, tripId);
        setPassengers(passengersData);
      } catch (err) {
        console.error("Failed to fetch passengers: ", err);
      } finally {
        setLoadingPassengers(false);
      }
    };

    getPassengers();
  }, [provider, tripId]);

  return { passengers, loadingPassengers };
};

// Hook for trip booking actions
export const useTripActions = (provider, tripId, trip) => {
  const [bookingStatus, setBookingStatus] = useState({
    loading: false,
    error: null,
  });
  const [completeStatus, setCompleteStatus] = useState({
    loading: false,
    error: null,
  });

  const handleBookTrip = async () => {
    if (!trip || !tripId || !provider) {
      setBookingStatus({
        loading: false,
        error: "Trip details or provider not available",
      });
      return;
    }

    setBookingStatus({ loading: true, error: null });

    try {
      await bookTrip(provider, tripId, trip.price);
      setBookingStatus({ loading: false, error: null });
      alert("Trip booked successfully!");
    } catch (error) {
      setBookingStatus({
        loading: false,
        error: error.message || "Failed to book trip",
      });
    }
  };

  const handleCompleteTrip = async () => {
    if (!tripId || !provider) {
      setCompleteStatus({
        loading: false,
        error: "Trip details or provider not available",
      });
      return;
    }

    setCompleteStatus({ loading: true, error: null });

    try {
      await completeTrip(tripId, provider);
      setCompleteStatus({ loading: false, error: null });
      alert("Trip completed successfully!");
    } catch (error) {
      setCompleteStatus({
        loading: false,
        error: error.message || "Failed to complete trip",
      });
    }
  };

  const handleCancelTrip = async () => {
    try {
      await cancelTrip(provider, tripId);
      alert("Trip cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel trip: ", error);
      alert(error.message || "Failed to cancel trip");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(provider, tripId);
      alert("Booking cancelled successfully!");
      return await fetchOneTrip(provider, tripId);
    } catch (error) {
      console.error("Failed to cancel booking: ", error);
      alert(error.message || "Failed to cancel booking");
    }
  };

  const handleRescheduleTrip = async (pickupTime, dropoffTime) => {
    try {
      await rescheduleTrip(provider, tripId, pickupTime, dropoffTime);
      alert("Trip rescheduled successfully!");
      return await fetchOneTrip(provider, tripId);
    } catch (error) {
      console.error("Failed to reschedule trip: ", error);
      alert(error.message || "Failed to reschedule trip");
    }
  };

  return {
    handleBookTrip,
    handleCompleteTrip,
    handleCancelTrip,
    handleCancelBooking,
    handleRescheduleTrip,
    bookingStatus,
    completeStatus,
  };
};
