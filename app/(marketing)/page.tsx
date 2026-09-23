import EventSection from "@/components/landingPage/eventsSection";
import HeroSection from "@/components/landingPage/heroSection";
import MeetHostSection from "@/components/landingPage/meetHosts";
import OrbitProjects from "@/components/orbitanimaton/orbitAnimation";
import OrbitProjectsMobile from "@/components/orbitanimaton/orbitanimationMobile";
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

            <div className="relative hidden lg:block bg-white">
                 <OrbitProjects/>
            </div>
            <div className="relative  lg:hidden   ">

                 <OrbitProjectsMobile/>
            </div>
            
            <div className="relative  bg-white">
                <MeetHostSection/>
            </div>
        </div>
    </main>
    </>)
}