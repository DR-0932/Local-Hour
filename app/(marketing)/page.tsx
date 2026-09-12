import EventSection from "@/app/components/eventsSection";
import HeroSection from "@/app/components/heroSection";
import MeetHostSection from "@/app/components/meetHosts";
import UpcomingEventSection from "@/app/components/upcomingEvents";
import VenueInfoSection from "@/app/components/VenueInfoSection";
import EventSectionMobile from "../components/mobile/eventSection.Mobile";

export default function Page(){

    return(<>
        <div>
            <HeroSection/>
        </div>
        <div className="hidden md:block">
            <EventSection/>
        </div>
        {/* <div className="block md:hidden">
            <EventSectionMobile/>
        </div> */}
        <div>
            <VenueInfoSection />
        </div>
        <div>
            <UpcomingEventSection/>
        </div>
        <div>
            <MeetHostSection/>
        </div>
    </>)
}