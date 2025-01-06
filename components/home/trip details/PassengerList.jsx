import { useState } from "react";
import { Users, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MessageButton from "./MessageButton";

export default function PassengersList({
  driver,
  passengers,
  loadingPassengers,
  availableSeats,
  ratings,
  handleRatingChange,
  handleBatchRatingSubmission,
  ratingStatus,
  togglePassengersList,
  showPassengers,
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-teal-500" />
          <span className="font-semibold">Available Seats:</span>
          <span>{availableSeats || "N/A"}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={togglePassengersList}
          className="text-teal-500 border-teal-500 hover:bg-teal-50"
        >
          {showPassengers ? "Hide Participants" : "Show Participants"}
        </Button>
      </div>
      {showPassengers && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Trip Participants:</h4>
          {loadingPassengers ? (
            <p className="text-sm text-gray-500">Loading participants...</p>
          ) : (
            <div>
              <ul className="space-y-4">
                <li className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Driver: {`${driver.slice(0, 6)}...${driver.slice(-4)}`}
                      </span>
                      <span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={ratings[driver] || ""}
                        onChange={(e) =>
                          handleRatingChange(driver, e.target.value)
                        }
                        className="w-16 text-center"
                      />
                    </div>
                  </div>
                </li>
                {passengers.length > 0 ? (
                  passengers.map((passenger, index) => (
                    <li
                      key={index}
                      className="p-2 bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-teal-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {`${passenger.address.slice(
                              0,
                              6
                            )}...${passenger.address.slice(-4)}`}
                          </span>
                          {passenger.averageRating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {passenger.averageRating > 0
                                  ? `${(passenger.averageRating / 100)
                                      .toFixed(2)
                                      .replace(".", ",")} (${
                                      passenger.ratingCount
                                    })`
                                  : `0,00 (${passenger.ratingCount})`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageButton recipientAddress={passenger.address} />
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={ratings[passenger.address] || ""}
                            onChange={(e) =>
                              handleRatingChange(
                                passenger.address,
                                e.target.value
                              )
                            }
                            className="w-16 text-center"
                          />
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No passengers booked yet.
                  </p>
                )}
              </ul>
              <div className="mt-4 flex justify-end">
                <Button
                  className="max-w-md"
                  size="lg"
                  onClick={handleBatchRatingSubmission}
                  disabled={ratingStatus.loading}
                >
                  {ratingStatus.loading
                    ? "Submitting..."
                    : "Submit All Ratings"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
