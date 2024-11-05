import { ethers } from "ethers";
import { tripContractAbi } from "@/lib/TripContractAbi";

const CONTRACT_ADDRESS = "0xD76c37c09C7C01A128e08eC45857822b0C340492";
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
    const tripContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Convert the price from ETH to Wei
    const priceInWei = ethers.parseEther(price.toString());

    console.log("Booking trip with details:", {
      tripId,
      price,
      priceInWei: priceInWei.toString(),
    });

    // Call the bookTrip function with the required payment
    const tx = await tripContract.bookTrip(tripId, {
      value: priceInWei,
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Check if the transaction was successful
    if (receipt.status === 1) {
      // Get the TripBooked event from the transaction receipt
      const tripBookedEvent = receipt.events?.find(
        (event) => event.event === "TripBooked"
      );

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

    throw new Error("Transaction failed or event not found");
  } catch (error) {
    // Handle specific error cases
    if (error.message.includes("Already booked this trip")) {
      throw new Error("You have already booked this trip");
    } else if (error.message.includes("No seats available")) {
      throw new Error("No seats available for this trip");
    } else if (error.message.includes("Trip pickup time has passed")) {
      throw new Error("This trip's pickup time has already passed");
    } else if (error.message.includes("Incorrect payment amount")) {
      throw new Error("Incorrect payment amount provided");
    }

    // Log the full error for debugging
    console.error("Error booking trip:", error);
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

    const tx = await tripContract.completeTrip(tripId);
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
