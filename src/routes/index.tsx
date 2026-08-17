import React, { Suspense } from "react";
import { HeroSlider } from "@/components/site/HeroSlider";
import { AnnouncementHub } from "@/components/site/AnnouncementHub";
import { WhyChooseADF } from "@/components/site/WhyChooseADF";

const PublishCTA = React.lazy(() => import("@/components/site/PublishCTA"));

import { CoreValues } from "@/components/site/CoreValues";
import { Statistics } from "@/components/site/Statistics";
import { FeaturedVideo } from "@/components/site/FeaturedVideo";

export default function Index() {
  return (
    <>
      <HeroSlider />
      <AnnouncementHub />
      <FeaturedVideo />
      <Statistics />
      <Suspense fallback={<div className="h-[500px] w-full bg-[var(--deep)] animate-pulse flex items-center justify-center"><span className="text-white/50">Loading Editor...</span></div>}>
        <PublishCTA />
      </Suspense>
      <WhyChooseADF />
      <CoreValues />
    </>
  );
}




