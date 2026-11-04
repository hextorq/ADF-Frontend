import { HeroSlider } from "@/components/site/HeroSlider";
import { InterdisciplinaryHorizonsCall } from "@/components/campaign/InterdisciplinaryHorizonsCall";
import { AnnouncementHub } from "@/components/site/AnnouncementHub";
import { WhyChooseADF } from "@/components/site/WhyChooseADF";
import { BookstoreShowcase } from "@/components/site/BookstoreShowcase";
import { CoreValues } from "@/components/site/CoreValues";
import { Statistics } from "@/components/site/Statistics";
import { FeaturedVideo } from "@/components/site/FeaturedVideo";

export default function Index() {
  return (
    <>
      <HeroSlider />
      {/* Featured Call for Abstract Submission */}
      <InterdisciplinaryHorizonsCall />
      <AnnouncementHub />
      <FeaturedVideo />
      <Statistics />
      <BookstoreShowcase />
      <WhyChooseADF />
      <CoreValues />
    </>
  );
}
