import { ethers } from "ethers";
import { tripContractAbi } from "@/lib/TripContractAbi";

const CONTRACT_ADDRESS = "0x42c8dE06885098325cacBa34bbCC818230D7A526";
const CONTRACT_ABI = tripContractAbi;

export const fetchAllTrips = async (provider) => {
  try {
    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Get the total number of trips
    const tripCount = await tripContract.tripCount();
    console.log("Total number of trips:", tripCount.toString());

    const allTrips = [];

    // Loop through each trip and check if it exists before fetching details
    for (let i = 1; i <= tripCount; i++) {
      try {
        const tripDetails = await tripContract.getTripDetails(i);
        const tripSchedule = await tripContract.getTripSchedule(i);
        const pickupTime = new Date(Number(tripSchedule[0]) * 1000);
        const dropoffTime = new Date(Number(tripSchedule[1]) * 1000);

        const formattedTripDetails = {
          tripId: i.toString(),
          pickupLocation: tripDetails.pickupLocation,
          dropoffLocation: tripDetails.dropoffLocation,
          pickupTime: pickupTime,
          dropoffTime: dropoffTime,
          price: ethers.formatEther(tripDetails.price),
          availableSeats: tripDetails.availableSeats.toString(),
          completed: tripDetails.completed,
        };

        console.log("Fetched trip details:", formattedTripDetails);
        allTrips.push(formattedTripDetails);
      } catch (error) {
        console.error(`Error fetching trip details for ID ${i}:`, error);
      }
    }

    return allTrips;
  } catch (error) {
    console.error("Error fetching all trips:", error);
    throw error;
  }
};

export const fetchOneTrip = async (provider, id) => {
  try {
    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tripDetails = await tripContract.getTripDetails(id);
    const tripSchedule = await tripContract.getTripSchedule(id);
    const escrowAmount = await tripContract.escrow(id);
    const pickupTime = new Date(Number(tripSchedule[0]) * 1000);
    const dropoffTime = new Date(Number(tripSchedule[1]) * 1000);

    const formattedTripDetails = {
      tripId: id,
      pickupLocation: tripDetails.pickupLocation,
      dropoffLocation: tripDetails.dropoffLocation,
      pickupTime: pickupTime,
      dropoffTime: dropoffTime,
      price: ethers.formatEther(tripDetails.price),
      availableSeats: tripDetails.availableSeats.toString(),
      completed: tripDetails.completed,
      isPaid: escrowAmount > 0, // check if there are funds in escrow
      escrowAmount: ethers.formatEther(escrowAmount),
    };

    console.log("Fetched one trip details:", formattedTripDetails);
    return formattedTripDetails;
  } catch (error) {
    console.error("Error fetching all trips:", error);
    throw error;
  }
};

export const bookTrip = async (provider, tripId, price) => {
  try {
    // Validate parameters
    if (!provider) {
      throw new Error("Provider is required");
    }
    if (!tripId) {
      throw new Error("Trip ID is required");
    }
    if (!price || typeof price !== "string") {
      throw new Error("Price must be a valid string value");
    }
    // Validate that price is a proper number string
    if (isNaN(parseFloat(price))) {
      throw new Error("Price must be a valid number");
    }

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Detailed logging
    console.log("Booking Trip Debug Info:", {
      signerAddress,
      tripId,
      price,
      contractAddress: CONTRACT_ADDRESS,
    });

    // Convert the price from ETH to Wei
    const priceInWei = ethers.parseEther(price.toString());

    // Call the bookTrip function with the required payment
    const tx = await tripContract.bookTrip(tripId, {
      value: priceInWei,
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Check if the transaction was successful
    if (receipt.status === 1) {
      // Get the TripBooked event from the transaction receipt
      const tripBookedEvent = receipt.logs.find((log) => {
        try {
          const parsedLog = tripContract.interface.parseLog(log);
          return parsedLog.name === "TripBooked";
        } catch {
          return false;
        }
      });

      if (tripBookedEvent) {
        const [bookingTripId, passenger, amount] = tripBookedEvent.args;

        return {
          success: true,
          tripId: bookingTripId.toString(),
          passenger,
          amount: ethers.formatEther(amount),
          transactionHash: receipt.transactionHash,
        };
      }
    }

    throw new Error("Transaction failed");
  } catch (error) {
    // Comprehensive error logging
    console.error("Full Booking Error:", {
      message: error.message,
      code: error.code,
      reason: error.reason,
      name: error.name,
      stack: error.stack,
      fullError: error,
    });

    // Handle specific error cases
    if (error.message.includes("Already booked this trip")) {
      throw new Error("You have already booked this trip");
    } else if (error.message.includes("No seats available")) {
      throw new Error("No seats available for this trip");
    } else if (error.message.includes("Trip pickup time has passed")) {
      throw new Error("This trip's pickup time has already passed");
    } else if (error.message.includes("Incorrect payment amount")) {
      throw new Error("Incorrect payment amount provided");
    } else if (error.message.includes("Driver cannot book their own trip")) {
      throw new Error("You cannot book your own trip as the driver");
    }
    throw error;
  }
};

// Function to complete a trip
export const completeTrip = async (tripId, provider) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }

    // Request accounts
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      throw new Error("MetaMask is not installed.");
    }

    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Check escrow balance first
    const escrowAmount = await tripContract.escrow(tripId);
    if (escrowAmount.toString() === "0") {
      throw new Error("Trip has not been paid for yet");
    }

    // Get trip schedule to check dropoff time
    const schedule = await tripContract.getTripSchedule(tripId);
    const currentTime = Math.floor(Date.now() / 1000); // Convert to Unix timestamp

    if (currentTime < Number(schedule[1])) {
      // schedule[1] is dropoffTime
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
    }
    throw error;
  }
};

export const fetchTripPassengers = async (tripId, provider) => {
  try {
    if (!provider) {
      throw new Error("Provider is required");
    }

    if (!tripId) {
      throw new Error("TripId is required");
    }
    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const passengers = await tripContract.getTripPassengers(tripId);

    const passengersWithRatings = await Promise.all(
      passengers.map(async (passenger) => {
        try {
          const rating = await tripContract.getPassengerRating(
            tripId,
            passenger
          );
          return {
            address: passenger,
            rating: rating > 0 ? rating.toString() : null,
          };
        } catch (err) {
          return {
            address: passenger,
            rating: null,
          };
        }
      })
    );

    console.log("Fetched passengers for trip: ", {
      tripId,
      passengers: passengersWithRatings,
    });

    return passengersWithRatings;
  } catch (error) {
    console.error("Error fetching trip passengers:", error);
    throw error;
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

    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

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
    }
    throw error;
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

    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

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
    if (error.message.includes("Only driver can cancel")) {
      throw new Error("Only the trip driver can cancel this trip");
    }
    if (error.message.includes("Trip already completed")) {
      throw new Error("Cannot cancel a completed trip");
    }
    throw error;
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

    const signer = await provider.getSigner();
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const gasLimit = await tripContract.cancelBooking.estimateGas(tripId);
    const tx = await tripContract.cancelBooking(tripId, { gasLimit });

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
    }
    throw error;
  }
};
