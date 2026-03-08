import { Hero } from "@/components/home/hero";
import { TheShift } from "@/components/home/the-shift";
import { SystemModel } from "@/components/home/system-model";
import { SelectedStories } from "@/components/home/selected-systems";
import { Outcomes } from "@/components/home/outcomes";
import { Philosophy } from "@/components/home/philosophy";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <TheShift />
      <SystemModel />
      <SelectedStories />
      <Outcomes />
      <Philosophy />
    </>
  );
}
