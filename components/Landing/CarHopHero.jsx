
import Image from "next/image";
import {CarFront } from "lucide-react";
import MetaButton from "../metamask/MetaButton";
import { RideButtons } from "./RideButtons";

export function CarHopHero() {

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-teal-400 to-blue-500">
      <Image
        src="/images/carHeroImage.jpg"
        alt="People riding in a car"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />
      <div className="absolute right-4 top-4 z-10">
        <MetaButton />
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

        <RideButtons />
      </div>
    </div>
  );
}
