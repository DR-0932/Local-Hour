import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  MessageCircle,
  Coffee,
} from "lucide-react";

export default function VenueInfoSection() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10 text-center md:mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-stone sm:text-sm">
            About Us
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl">
            Something new is better
            <br />
            when shared with others.
          </h2>
        </div>


        {/* ================= BENTO GRID ================= */}

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">


          {/* ================= MISSION ================= */}

          <div
            className="
              group
              relative
              min-h-[440px]
              overflow-hidden
              rounded-[28px]
              border-2
              border-ink
              bg-surface
              p-6
              shadow-[7px_8px_0px_var(--ink-shadow)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[11px_13px_0px_var(--ink-shadow)]
              md:col-span-2
              md:row-span-2
              md:min-h-[500px]
              md:p-10
            "
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-600">
              Our Mission
            </p>

            <h3 className="mt-7 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-neutral-950 md:mt-8 md:text-[40px]">
              Come for something new.
              <br />
              Stay for the connections.
            </h3>

            <p className="mt-5 max-w-lg text-base leading-7 text-neutral-800 sm:text-lg sm:leading-8 md:mt-6">
            We create welcoming spaces for people to disconnect with screens and scrolls and connect more with people and surroundings.
            </p>


            {/* Decorative text */}

            <div className="absolute bottom-6 left-6 md:bottom-9 md:left-10">
              <p className="rotate-[-5deg] font-serif text-xl italic sm:text-2xl">
                New people
              </p>

              <p className="ml-6 rotate-[-5deg] font-serif text-xl italic sm:ml-8 sm:text-2xl">
                Brighter Sundays
              </p>

              <div className="ml-12 mt-2 h-[3px] w-24 rotate-[-12deg] rounded-full bg-neutral-900 transition-all duration-300 group-hover:w-32" />
            </div>


            {/* Image */}

            <div
              className="
                absolute
                bottom-9
                right-8
                hidden
                h-[290px]
                w-[210px]
                overflow-hidden
                rounded-[24px]
                border-2
                border-neutral-900
                md:block
              "
            >
              <img
                src="/cafe.jpg"
                alt="People connecting over coffee"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

          </div>


          {/* ================= WHO IS IT FOR ================= */}

          <div
            className="
              group
              min-h-[245px]
              rounded-[28px]
              border-2
              border-ink
              bg-fog
              p-6
              shadow-[6px_7px_0px_var(--ink-shadow)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[10px_12px_0px_var(--ink-shadow)]
            "
          >

            <div className="flex items-start justify-between">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-600">
                Who Is It For?
              </p>

              <Users
                size={40}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:scale-110"
              />

            </div>

            <h3 className="mt-5 text-3xl font-bold tracking-tight md:mt-6">
              Everyone.
            </h3>

            <p className="mt-4 text-base leading-7 text-neutral-800">
              Open to all age groups and experience levels. If you&apos;re
              looking to try something new and make new connections,
              you&apos;re welcome here.
            </p>

          </div>


          {/* ================= SUNDAY ================= */}

          <div
            className="
              group
              min-h-[250px]
              rounded-[28px]
              border-2
              border-ink
              bg-stone
              p-6
              shadow-[6px_7px_0px_var(--ink-shadow)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[10px_12px_0px_var(--ink-shadow)]
            "
          >

            <div className="flex items-start justify-between">

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-600">
                General Sessions
              </p>

              <CalendarDays
                size={35}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:rotate-6"
              />

            </div>

            <h3 className="mt-5 text-2xl font-bold tracking-tight md:mt-6">
              Every Sunday
            </h3>

            <p className="mt-2 text-xl">
              3:00 PM - 5:00 PM
            </p>

            <p className="mt-6 text-sm leading-6 text-neutral-700">
              Unless an event announcement states otherwise.
            </p>

          </div>


          {/* ================= LOCATION ================= */}

          <div
            className="
              group
              relative
              min-h-[250px]
              overflow-hidden
              rounded-[28px]
              border-2
              border-ink
              bg-paper
              p-6
              shadow-[6px_7px_0px_var(--ink-shadow)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[10px_12px_0px_var(--ink-shadow)]
            "
          >

            <div className="flex items-start justify-between">

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-600">
                Find Us
              </p>

              <MapPin
                size={37}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />

            </div>

            <h3 className="mt-5 text-2xl font-bold tracking-tight md:mt-6">
              Tealogy
            </h3>

            <p className="mt-2 text-lg">
              Makronia, Sagar
            </p>

            <Coffee
              size={58}
              strokeWidth={1.3}
              className="
                absolute
                bottom-5
                right-6
                transition-all
                duration-500
                group-hover:-translate-y-2
                group-hover:rotate-[-8deg]
              "
            />

          </div>


          {/* ================= WHATSAPP ================= */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[28px]
              border-2
              border-ink
              bg-fog
              px-6
              py-7
              shadow-[6px_7px_0px_var(--ink-shadow)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[10px_12px_0px_var(--ink-shadow)]
              md:col-span-2
              md:px-8
              md:py-9
            "
          >

            <div className="max-w-xl">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-600">
                Stay Updated
              </p>

              <h3 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Never miss an update.
              </h3>

              <p className="mt-4 text-base leading-7 text-neutral-800">
                Join our WhatsApp group for upcoming sessions, events,
                schedule changes, and everything happening in the
                community.
              </p>

            </div>


            {/* Buttons */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border-2
                  border-ink
                  bg-ink
                  w-full
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-paper
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[4px_5px_0px_var(--ink-shadow)]
                  sm:w-auto
                "
              >
                <MessageCircle size={19} />

                Join WhatsApp

                <ArrowRight size={17} />
              </a>


              <a
                href="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border-2
                  border-ink
                  bg-paper
                  w-full
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-ink
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[4px_5px_0px_rgba(0,0,0,0.3)]
                  sm:w-auto
                "
              >
                Join Now
                <ArrowRight size={17} />
              </a>

            </div>


            {/* Decorative text */}

            <div className="absolute bottom-8 right-8 hidden rotate-[-5deg] lg:block">
              <p className="font-serif text-xl italic text-neutral-600">
                Be part of
              </p>

              <p className="ml-5 font-serif text-xl italic text-neutral-600">
                our community ♡
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
