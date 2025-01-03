"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Drill,
} from "lucide-react";
import { tripContractAbi } from "@/lib/TripContractAbi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRIP_CONTRACT_ADDRESS;
const CONTRACT_ABI = tripContractAbi;

export default function AddTrip() {
  const [tripData, setTripData] = useState({
    origin: "",
    destination: "",
    date: "",
    price: "",
    pickupTime: "",
    dropoffTime: "",
    availableSeats: "4",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateTimes = (pickupTimestamp, dropoffTimestamp) => {
    const now = Math.floor(Date.now() / 1000);

    if (pickupTimestamp <= now) {
      throw new Error("Pickup time must be in the future");
    }

    if (dropoffTimestamp <= pickupTimestamp) {
      throw new Error("Dropoff time must be after pickup time");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTxHash("");

    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("Starting transaction process...");

        const pickupDateTime = new Date(
          `${tripData.date}T${tripData.pickupTime}`
        );
        const dropoffDateTime = new Date(
          `${tripData.date}T${tripData.dropoffTime}`
        );

        const pickupTimestamp = Math.floor(pickupDateTime.getTime() / 1000);
        const dropoffTimestamp = Math.floor(dropoffDateTime.getTime() / 1000);

        console.log("Timestamps created:", {
          pickup: new Date(pickupTimestamp * 1000).toISOString(),
          dropoff: new Date(dropoffTimestamp * 1000).toISOString(),
        });

        validateTimes(pickupTimestamp, dropoffTimestamp);
        console.log("Time validation passed");

        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("Provider created");

        const signer = await provider.getSigner();
        console.log("Signer obtained:", await signer.getAddress());

        const tripContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        console.log("Contract instance created");

        const priceInWei = ethers.parseEther(tripData.price.toString());
        console.log("Price converted to Wei:", priceInWei.toString());

        const tx = await tripContract.createTrip(
          tripData.origin,
          tripData.destination,
          pickupTimestamp,
          dropoffTimestamp,
          priceInWei,
          parseInt(tripData.availableSeats, 10),
          true
        );
        console.log("Transaction submitted:", tx.hash);
        setTxHash(tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // Clear form after successful submission
        setTripData({
          origin: "",
          destination: "",
          date: "",
          price: "",
          pickupTime: "",
          dropoffTime: "",
          availableSeats: "4",
        });

        alert("Trip created successfully!");
      } catch (error) {
        console.error("Detailed error:", error);

        let errorMessage = "Transaction failed";
        if (error.reason) {
          errorMessage = error.reason;
        } else if (error.message) {
          errorMessage = error.message;
        }

        if (error.data) {
          console.log("Error data:", error.data);
        }

        setError(`There was an issue with blockchain, try again in a few minutes. ${errorMessage.substring(0, 60)}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please install MetaMask to continue.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-lg">
      <CardHeader className="bg-teal-500 text-white rounded-lg">
        <CardTitle className="text-2xl font-bold">Add a New Trip</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {txHash && (
            <div className="p-3 text-sm text-green-500 bg-green-100 rounded-md">
              Transaction submitted: {txHash.slice(0, 15)}...
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                Origin
              </Label>
              <Input
                id="origin"
                name="origin"
                value={tripData.origin}
                onChange={handleInputChange}
                placeholder="Enter origin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                value={tripData.destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={tripData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-teal-500" />
                Price (POL)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={tripData.price}
                onChange={handleInputChange}
                placeholder="Enter price in POL"
                min="0"
                step="0.0001"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pickupTime" className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-teal-500" />
                Pickup Time
              </Label>
              <Input
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={tripData.pickupTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffTime" className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-teal-500" />
                Drop-off Time
              </Label>
              <Input
                id="dropoffTime"
                name="dropoffTime"
                type="time"
                value={tripData.dropoffTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSeats" className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-teal-500" />
                Available Seats
              </Label>
              <Input
                id="availableSeats"
                name="availableSeats"
                type="number"
                value={tripData.availableSeats}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Trip..." : "Add Trip"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
