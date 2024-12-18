"use client";

import { Button } from "@/components/ui/Button";
import { Car, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export function RideButtons() {
  const router = useRouter();

  const handleButtonClick = async (href) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          router.push(href);
        } else {
          alert("Please connect your wallet to MetaMask");
        }
      } catch (error) {
        alert("Error connecting to MetaMask: " + error.message);
      }
    } else {
      alert("Please initiate MetaMask to continue");
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Button
        size="lg"
        className="bg-teal-500 hover:bg-teal-600"
        onClick={() => handleButtonClick("/home")}
      >
        <Car className="mr-2 h-5 w-5" />
        Find a Ride
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="bg-white/10 text-white hover:bg-white/20"
        onClick={() => handleButtonClick("/home")}
      >
        <Users className="mr-2 h-5 w-5" />
        Offer a Ride
      </Button>
    </div>
  );
}
