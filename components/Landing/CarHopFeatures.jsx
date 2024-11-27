import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { User, Truck, Package } from "lucide-react";
import { RoadAnimationComponent } from "./RoadAnimation";

export function CarHopFeatures() {
  return (
    <section className="relative h-full bg-gray-100">
      <RoadAnimationComponent />

      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-[50px] text-center text-3xl font-bold text-gray-800">
          Choose Your CarHop Adventure !
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-blue-50 transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <User className="mr-2 h-6 w-6" />
                Be a Passenger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700">
                Hop in and enjoy the ride! Find convenient and affordable trips
                to your destination. Meet new people and share the journey.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Truck className="mr-2 h-6 w-6" />
                Be a Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700">
                Take the wheel and earn! Offer rides, choose your schedule, and
                make money while helping others get around. It&apos;s that easy!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Package className="mr-2 h-6 w-6" />
                Be a Package!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700">
                Need to send something? Turn your item into a traveler! Our
                drivers can deliver your packages safely and quickly. It&apos;s
                like hitchhiking for your stuff!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
