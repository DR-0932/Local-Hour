import ExpandableCardDemo from "./expandable-card-demo-standard";

export default function UpcomingEventSection(){
    return(
        <section className="overflow-hidden bg-paper  text-ink ">
            <div className=" ">
                {/* <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2> */}
                <ExpandableCardDemo/>
            </div>
        </section>

    )
}
