import { createFileRoute } from "@tanstack/react-router";
import { RideCanvas } from "@/components/ride/RideCanvas";
import { RideHud } from "@/components/ride/RideHud";
import { PickupStop } from "@/components/stops/PickupStop";
import { QuantumMetricStop } from "@/components/stops/QuantumMetricStop";
import { RenaroStop } from "@/components/stops/RenaroStop";
import { StyleumStop } from "@/components/stops/StyleumStop";
import { MoreWorkStop } from "@/components/stops/MoreWorkStop";
import { AboutStop } from "@/components/stops/AboutStop";
import { DropoffStop } from "@/components/stops/DropoffStop";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Sameer Akhtar | Software Engineer & Founder",
        description: site.description,
        keywords:
          "Sameer Akhtar, software engineer, Chicago, Quantum Metric, Renaro, Styleum, HazardLens, DePaul University, new grad software engineer 2027, TypeScript, Go, React, PostgreSQL, computer vision",
        url: site.url,
      }),
    ],
    links: [{ rel: "canonical", href: site.url }],
  }),
  component: Home,
});

const NO_SCRIPT_CSS =
  ".transit{height:4rem}.stop:not(.stop-hero){min-height:0}.cover-line>span,.hero-foot,.hero-cue{animation:none}";

/** The home page is one ride: each section below is a stop on the route. */
function Home() {
  return (
    <>
      <RideCanvas />
      {/* Without scripts there is no scene and no reveal, so lay the page out plainly. */}
      <noscript>
        <style>{NO_SCRIPT_CSS}</style>
      </noscript>
      <PickupStop />
      <QuantumMetricStop />
      <RenaroStop />
      <StyleumStop />
      <MoreWorkStop />
      <AboutStop />
      <DropoffStop />
      <RideHud />
    </>
  );
}
