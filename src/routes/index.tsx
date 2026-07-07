import { HeroSlider } from "@/components/site/HeroSlider";
import { AnnouncementHub } from "@/components/site/AnnouncementHub";
import { WhyChooseADF } from "@/components/site/WhyChooseADF";


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
      <WhyChooseADF />
      <CoreValues />
    </>
  );
}




