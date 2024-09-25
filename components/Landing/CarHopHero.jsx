"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import {
  Car,
  Users,
  LogIn,
  CarTaxiFront,
  CarFront,
  Caravan,
  CaravanIcon,
} from "lucide-react";
import Link from "next/link";

export function CarHopHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-teal-400 to-blue-500">
      <Image
        src="/images/carHeroImage.jpg"
        alt="People riding in a car"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />
      <div className="absolute right-4 top-4 z-10">
        <Link href="/register">
          <Button
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Register
          </Button>
        </Link>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-8 flex items-center text-6xl font-bold text-white drop-shadow-lg font-yeseva">
          CarHop
          <span className="ml-4 inline-block animate-bounce">
            <CarFront className="h-12 w-12 transform rotate-12" />
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-xl text-white drop-shadow-md">
          Hop in, hop out! Your friendly neighborhood ride-sharing app
        </p>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/login">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
              <Car className="mr-2 h-5 w-5" />
              Find a Ride
            </Button>
          </Link>
          <Link href='/login'>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <Users className="mr-2 h-5 w-5" />
              Offer a Ride
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
