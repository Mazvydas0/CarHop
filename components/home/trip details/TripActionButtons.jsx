import { Button } from "@/components/ui/button";
import RescheduleDialog from "@/components/home/RescheduleDialog";

export default function TripActionButtons({
  showCompleteButton,
  trip,
  bookingStatus,
  completeStatus,
  handleBookTrip,
  handleCompleteTrip,
  handleCancelTrip,
  handleCancelBooking,
  rescheduleData,
  setRescheduleData,
  handleRescheduleTrip,
}) {
  return (
    <div className="text-center">
      {bookingStatus.error && (
        <p className="text-red-500 mb-2">{bookingStatus.error}</p>
      )}
      <div className="flex flex-col items-center">
        <div id="trip-booking">
          <Button
            className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
            size="lg"
            onClick={handleBookTrip}
            disabled={showCompleteButton || trip.completed}
          >
            {bookingStatus.loading ? "Booking..." : "Book This Ride"}
          </Button>
          {showCompleteButton && !trip.completed && (
            <div className="mt-4">
              {completeStatus.error && (
                <p className="text-red-500 mb-2">{completeStatus.error}</p>
              )}
              <Button
                className="w-full max-w-md bg-teal-500 hover:bg-teal-600"
                size="lg"
                onClick={handleCompleteTrip}
                disabled={completeStatus.loading || !trip.isPaid}
              >
                {completeStatus.loading ? "Completing..." : "Complete Trip"}
              </Button>
              {!trip.isPaid && (
                <p className="text-sm text-gray-500 mt-2">
                  Trip must be paid for before it can be completed
                </p>
              )}
            </div>
          )}
        </div>
        {!trip.completed && (
          <div id="trip-modifying" className="flex mt-6 space-x-4">
            <div>
              <Button
                variant="outline"
                className="w-48 max-w-md border-teal-500 text-teal-500 hover:border-teal-600 hover:text-teal-600"
                onClick={handleCancelTrip}
              >
                Cancel Trip
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-48 max-w-md border-teal-500 text-teal-500 hover:border-teal-600 hover:text-teal-600"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </Button>
            </div>
            <div>
              <RescheduleDialog
                rescheduleData={rescheduleData}
                setRescheduleData={setRescheduleData}
                handleRescheduleTrip={handleRescheduleTrip}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
