import { CarHopFeatures } from "@/components/Landing/CarHopFeatures";
import { CarHopHero } from "@/components//Landing/CarHopHero";

export default function Home() {
  return (
    <div className="flex-col">
      <div className="">
        <CarHopHero />
      </div>
      <div className="">
        <CarHopFeatures />
      </div>
    </div>
  );
}
