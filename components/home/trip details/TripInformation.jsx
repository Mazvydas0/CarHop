import { MapPin, ArrowRight, Clock } from "lucide-react";
export default function TripInformation({
  pickupLocation,
  dropoffLocation,
  pickupTime,
  dropoffTime,
  price,
}) {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6 text-teal-500" />
          <span className="text-lg font-semibold">
            {pickupLocation || "N/A"}
          </span>
        </div>
        <ArrowRight className="h-6 w-6 text-teal-500" />
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6 text-teal-500" />
          <span className="text-lg font-semibold">
            {dropoffLocation || "N/A"}
          </span>
        </div>
      </div>

      <div className="mb-8 flex justify-between gap-4">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-teal-500" />
          <span className="font-semibold">Pickup:</span>
          <span>
            {pickupTime
              ? pickupTime.toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-teal-500" />
          <span className="font-semibold">Dropoff:</span>
          <span>
            {dropoffTime
              ? dropoffTime.toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mb-8 text-center">
        <span className="text-3xl font-bold text-teal-600">
          {price} POL
        </span>
      </div>
    </div>
  );
}
