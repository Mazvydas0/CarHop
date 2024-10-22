import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Car, Package, Rocket } from "lucide-react";

export default function FeedLegend() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-teal-700">
          Post Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-700">Carpool offer</span>
          </li>
          <li className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">Package delivery</span>
          </li>
          <li className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-700">Looking for a ride</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
