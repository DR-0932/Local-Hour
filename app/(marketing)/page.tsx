import EventSection from "@/components/landingPage/eventsSection";
import HeroSection from "@/components/landingPage/heroSection";
import HeroLanding from "@/components/landingPage/Landing";
import MeetHostSection from "@/components/landingPage/meetHosts";
import OrbitProjects from "@/components/orbitanimaton/orbitanimationClaude";
import VenueInfoSection from "@/components/VenueInfoSection";
import Navbar from "@/ui/navbar";


export default function Page(){

    


    return(<>
    <main className="wrapper">
        <div className="content scroll-smooth">
            <div className="sticky top-0 z-0">
                {/* <HeroLanding/> */}
                <Navbar/>

                <HeroSection/>
            </div>
            <div className="relative  bg-white mx-0.25 ">
                <EventSection/>
            </div>
            {/* <div className="block md:hidden">
                <EventSectionMobile/>
            </div> */}
            <div className="relative  bg-white">
                {/* <VenueInfoSection />
                 */}
                 <OrbitProjects/>
            </div>
            
            <div className="relative  bg-white">
                <MeetHostSection/>
            </div>
        </div>
    </main>
    </>)
}