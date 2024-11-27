import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DriverCard({ driver, driverAverageRating }) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <Image
            src="/images/noProfile.png"
            alt="Driver"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">{driver || "Driver Name"}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2">
                {(driverAverageRating / 100).toFixed(2).replace(".", ",")}
              </span>
            </div>
            <p className="mt-2 text-gray-600">Vehicle details placeholder</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
