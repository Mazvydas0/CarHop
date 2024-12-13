import { CarHopFeatures } from "./CarHopFeatures";
import { CarHopHero } from "./CarHopHero";

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow-0 basis-[70%]">
        <CarHopHero />
      </div>
      <div className="flex-grow-0 basis-[30%]">
        <CarHopFeatures />
      </div>
    </div>
  );
}
