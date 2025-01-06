import { ethers } from "ethers";
import { tripContractAbi } from "@/lib/TripContractAbi";
import { ratingContractAbi } from "@/lib/RatingContractAbi";

const TRIP_ADDRESS = process.env.NEXT_PUBLIC_TRIP_CONTRACT_ADDRESS;
const RATING_ADDRESS = process.env.NEXT_PUBLIC_RATING_CONTRACT_ADDRESS;

const getContracts = async (provider) => {
  const signer = await provider.getSigner();
  return {
    tripContract: new ethers.Contract(TRIP_ADDRESS, tripContractAbi, signer),
    ratingContract: new ethers.Contract(
      RATING_ADDRESS,
      ratingContractAbi,
      signer
    ),
  };
};

export const fetchAllTrips = async (provider) => {
  try {
    const { tripContract, ratingContract } = await getContracts(provider);
    const tripCount = await tripContract.tripCount();
    const allTrips = [];

    for (let i = 1; i <= tripCount; i++) {
      try {
        const tripDetails = await tripContract.getTripDetails(i);
        const tripSchedule = await tripContract.getTripSchedule(i);
        const [driverRating, driverRatingCount] =
          await ratingContract.calculateUserAverageRating(tripDetails.driver);

        allTrips.push({
          tripId: i.toString(),
          pickupLocation: tripDetails.pickupLocation,
          dropoffLocation: tripDetails.dropoffLocation,
          pickupTime: new Date(Number(tripSchedule[0]) * 1000),
          dropoffTime: new Date(Number(tripSchedule[1]) * 1000),
          price: ethers.formatEther(tripDetails.price),
          availableSeats: tripDetails.availableSeats.toString(),
          completed: tripDetails.completed,
          driver: tripDetails.driver,
          driverAverageRating: driverRating.toString(),
          driverRatingCount: driverRatingCount.toString(),
        });
      } catch (error) {
        console.error(`Error fetching trip ${i}:`, error);
      }
    }
    return allTrips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export const fetchOneTrip = async (provider, id) => {
  try {
    const { tripContract, ratingContract } = await getContracts(provider);
    const [tripDetails, tripSchedule, escrowAmount] = await Promise.all([
      tripContract.getTripDetails(id),
      tripContract.getTripSchedule(id),
      tripContract.escrow(id),
    ]);

    const [driverRating, driverRatingCount] =
      await ratingContract.calculateUserAverageRating(tripDetails.driver);

    return {
      tripId: id,
      pickupLocation: tripDetails.pickupLocation,
      dropoffLocation: tripDetails.dropoffLocation,
      pickupTime: new Date(Number(tripSchedule[0]) * 1000),
      dropoffTime: new Date(Number(tripSchedule[1]) * 1000),
      price: ethers.formatEther(tripDetails.price),
      availableSeats: tripDetails.availableSeats.toString(),
      completed: tripDetails.completed,
      isPaid: escrowAmount > 0,
      escrowAmount: ethers.formatEther(escrowAmount),
      driver: tripDetails.driver,
      driverAverageRating: driverRating.toString(),
      driverRatingCount: driverRatingCount.toString(),
    };
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
};

export const bookTrip = async (provider, tripId, price) => {
  if (!provider || !tripId || !price || isNaN(parseFloat(price))) {
    throw new Error("Invalid parameters for booking");
  }

  const { tripContract } = await getContracts(provider);
  const priceInWei = ethers.parseEther(price.toString());

  try {
    const tx = await tripContract.bookTrip(tripId, { value: priceInWei });
    const receipt = await tx.wait();

    const event = receipt.logs.find((log) => {
      try {
        return tripContract.interface.parseLog(log).name === "TripBooked";
      } catch {
        return false;
      }
    });

    if (event) {
      const [bookingTripId, passenger, amount] = event.args;
      return {
        success: true,
        tripId: bookingTripId.toString(),
        passenger,
        amount: ethers.formatEther(amount),
        transactionHash: receipt.transactionHash,
      };
    }
    throw new Error("Transaction failed");
  } catch (error) {
    handleBookingError(error);
  }
};

export const completeTrip = async (provider, tripId) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }

    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      throw new Error("MetaMask is not installed.");
    }

    const { tripContract } = await getContracts(provider);

    const escrowAmount = await tripContract.escrow(tripId);
    if (escrowAmount.toString() === "0") {
      throw new Error("Trip has not been paid for yet");
    }

    const schedule = await tripContract.getTripSchedule(tripId);
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime < Number(schedule[1])) {
      throw new Error("Cannot complete trip before dropoff time");
    }

    const tx = await tripContract.confirmTripCompletion(tripId);
    const receipt = await tx.wait();

    return {
      success: true,
      tripId,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    if (error.message.includes("No funds in escrow")) {
      throw new Error("Trip has not been paid for yet");
    }
    if (error.message.includes("Trip not yet complete")) {
      throw new Error("Cannot complete trip before dropoff time");
    } else {
      throw new Error(
        `There was some issue with blockchain, try again in few minutes. Error: ${error.message}`
      );
    }
  }
};

export const rescheduleTrip = async (
  provider,
  tripId,
  newPickupTime,
  newDropoffTime
) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }
    if (!tripId) {
      throw new Error("Trip ID is required");
    }
    if (!newPickupTime || !newDropoffTime) {
      throw new Error("New pickup and dropoff times are required");
    }

    const pickupTimestamp = Math.floor(
      new Date(newPickupTime).getTime() / 1000
    );
    const dropoffTimestamp = Math.floor(
      new Date(newDropoffTime).getTime() / 1000
    );

    const { tripContract } = await getContracts(provider);

    const tx = await tripContract.updateTripSchedule(
      tripId,
      pickupTimestamp,
      dropoffTimestamp
    );

    const receipt = await tx.wait();

    return {
      success: true,
      tripId,
      newPickupTime: new Date(pickupTimestamp * 1000),
      newDropoffTime: new Date(dropoffTimestamp * 1000),
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    if (error.message.includes("Trip has already started or passed")) {
      throw new Error("Cannot reschedule a trip that has already started");
    }
    if (error.message.includes("Trip schedule is not flexible")) {
      throw new Error("This trip's schedule cannot be modified");
    }
    if (error.message.includes("New pickup time must be in the future")) {
      throw new Error("New pickup time must be in the future");
    }
    if (error.message.includes("New dropoff time must be after pickup time")) {
      throw new Error("Dropoff time must be after pickup time");
    } else {
      throw new Error(
        `There was some issue with blockchain, try again in few minutes. Error: ${error.message}`
      );
    }
  }
};

export const cancelTrip = async (provider, tripId) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }
    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    const { tripContract } = await getContracts(provider);

    const tx = await tripContract.cancelTrip(tripId);
    const receipt = await tx.wait();

    return {
      success: true,
      tripId,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    if (error.message.includes("Trip does not exist")) {
      throw new Error("Trip does not exist");
    }
    if (error.message.includes("Not the driver")) {
      throw new Error("Only the trip driver can cancel this trip");
    }
    if (error.message.includes("Trip already completed")) {
      throw new Error("Cannot cancel a completed trip");
    } else {
      throw new Error(`There was some issue with blockchain, try again in few minutes. Error: ${error.message}`);
    }
  }
};

export const cancelBooking = async (provider, tripId) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }
    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    const { tripContract } = await getContracts(provider);

    const tx = await tripContract.cancelBooking(tripId);
    const receipt = await tx.wait();

    return {
      success: true,
      tripId,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    if (error.message.includes("Too late to cancel")) {
      throw new Error("Cannot cancel booking - pickup time has passed");
    }
    if (error.message.includes("Trip does not exist")) {
      throw new Error("Trip does not exist");
    }
    if (error.message.includes("Not a passenger")) {
      throw new Error("You are not a passenger on this trip");
    } else {
      throw new Error(
        `There was some issue with blockchain, try again in few minutes. Error: ${error.message}`
      );
    }
  }
};

export const fetchTripPassengers = async (provider, tripId) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }
    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    const { tripContract, ratingContract } = await getContracts(provider);
    const passengers = await tripContract.getTripPassengers(tripId);

    const formattedPassengers = await Promise.all(
      passengers.map(async (passenger) => {
        try {
          const [PassengerAverageRating, PassengerRatingCount] =
            await ratingContract.calculateUserAverageRating(passenger);

          return {
            address: passenger,
            averageRating: PassengerAverageRating.toString(),
            ratingCount: PassengerRatingCount.toString(),
          };
        } catch (error) {
          console.error(
            `Error fetching rating for passenger ${passenger}:`,
            error
          );
          return {
            address: passenger,
            averageRating: null,
          };
        }
      })
    );

    return formattedPassengers;
  } catch (error) {
    console.error("Error fetching trip passengers:", error);
    throw error;
  }
};

export const rateDriver = async (provider, tripId, rating) => {
  try {
    const { tripContract } = await getContracts(provider);
    const tx = await tripContract.rateDriver(tripId, rating);
    const receipt = await tx.wait();
    return { success: true, transactionHash: receipt.transactionHash };
  } catch (error) {
    handleRatingError(error);
  }
};

export const ratePassengers = async (provider, tripId, passengers, ratings) => {
  try {
    const { tripContract } = await getContracts(provider);
    const tx = await tripContract.ratePassengers(tripId, passengers, ratings);
    const receipt = await tx.wait();
    return { success: true, transactionHash: receipt.transactionHash };
  } catch (error) {
    handleRatingError(error);
  }
};

const handleBookingError = (error) => {
  const errorMessages = {
    "Already booked this trip": "You have already booked this trip",
    "No seats available": "No seats available for this trip",
    "Trip pickup time has passed": "This trip's pickup time has already passed",
    "Incorrect payment amount": "Incorrect payment amount provided",
    "Driver cannot book their own trip":
      "You cannot book your own trip as the driver",
  };

  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) throw new Error(message);
  }
  throw error;
};

const handleRatingError = (error) => {
  const errorMessages = {
    "Trip not completed": "Cannot rate before trip completion",
    "Invalid rating": "Rating must be between 1 and 5",
    "Already rated": "You have already rated for this trip",
  };

  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) throw new Error(message);
  }
  throw error;
};


