// components/RescheduleDialog.js
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar } from "lucide-react";

export default function RescheduleDialog({
  rescheduleData,
  setRescheduleData,
  handleRescheduleTrip,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-48 max-w-md border-teal-500 text-teal-500 hover:border-teal-600 hover:text-teal-600"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Reschedule Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Reschedule Trip</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="pickupTime" className="text-right">
              Pickup Time
            </label>
            <Input
              id="pickupTime"
              type="datetime-local"
              className="col-span-3"
              value={rescheduleData.pickupTime}
              onChange={(e) =>
                setRescheduleData({
                  ...rescheduleData,
                  pickupTime: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="dropoffTime" className="text-right">
              Dropoff Time
            </label>
            <Input
              id="dropoffTime"
              type="datetime-local"
              className="col-span-3"
              value={rescheduleData.dropoffTime}
              onChange={(e) =>
                setRescheduleData({
                  ...rescheduleData,
                  dropoffTime: e.target.value,
                })
              }
            />
          </div>
        </div>
        <Button
          onClick={() =>
            handleRescheduleTrip(
              rescheduleData.pickupTime,
              rescheduleData.dropoffTime
            )
          }
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
