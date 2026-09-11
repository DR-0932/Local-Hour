import EventSection from "@/app/components/eventsSection";
import HeroSection from "@/app/components/heroSection";
import MeetHostSection from "@/app/components/meetHosts";
import UpcomingEventSection from "@/app/components/upcomingEvents";
import VenueInfoSection from "@/app/components/VenueInfoSection";

export default function Page(){

    return(<>
        <div>
            <HeroSection/>
        </div>
        <div>
            <EventSection/>
        </div>
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