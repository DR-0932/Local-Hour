import Image from "next/image";

const hosts = [
  {
    name: "Soumya Agarwal",
    image: "/hosts-image/soumya.jpeg",
    mobileDescription:
      "Content creator, full-time professional, book lover, and reliable source of a movie quote.",
    description:
      "Loves to meet new people and engage in meaningful conversation. Mostly found laughing at her own jokes or reading books. Created content for fun, works a full-time job for purpose, and always has something to teach or a movie dialogue to quote.",
  },
  {
    name: "Palak Agarwal",
    image: "/hosts-image/palak2.png",
    mobileDescription:
      "Creative planner with a soft spot for art, travel, food, fashion, sports, and staring at the sky.",
    description:
      "Loves creativity and art, writes, and automatically reads a lot. Loves to plan events, travelling, food, fashion, and sports — despite being able to play none. In her free time she stares at a wall or the sky.",
  },
];

export default function MeetHostSection() {
  return (
    <section className="overflow-hidden bg-paper px-5 py-16 sm:px-6 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-stone pb-8 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-12">
          <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-graphite">
            [ The people behind it ]
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-normal leading-[0.92] tracking-[-0.05em] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Meet Your Hosts.
          </h2>
        </div>

          <p className="max-w-[300px] text-sm leading-6 text-graphite">
            Two people who wanted to create a place where meeting someone new
            could be as simple as showing up.
          </p>
        </div>

        <div className="mt-8 grid gap-6 border-2 border-ink bg-surface p-5 shadow-[6px_6px_0px_var(--ink-shadow)] sm:p-6 md:mt-12 md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:p-9 md:shadow-[8px_8px_0px_var(--ink-shadow)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-graphite">
              The localHour rule
            </p>
            <h3 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.86] tracking-[-0.065em] text-ink sm:text-5xl md:text-7xl">
              Anti<br />brain-rot.
            </h3>
          </div>
          <div className="flex flex-col justify-between border-t border-ink pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="max-w-sm text-base leading-6 text-ink sm:text-lg sm:leading-7">
              Put the phone away. Trade the endless scroll for a real room, a
              real conversation, and a Sunday you&apos;ll actually remember.
            </p>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-graphite">
              No phones during club hours
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-20">
          <div className="mx-auto max-w-[680px]">
            <div className="grid grid-cols-2 gap-2 sm:gap-5">
              {hosts.map((host) => (
                <div key={host.name} className="group relative aspect-[3/4] overflow-hidden border-2 border-ink bg-fog shadow-[5px_5px_0px_var(--ink-shadow)] transition-transform duration-300 hover:-translate-y-1">
                  <Image
                    src={host.image}
                    alt={host.name}
                    width={680}
                    height={907}
                    sizes="(max-width: 640px) 45vw, 320px"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 divide-y divide-stone border-y border-stone sm:mt-7 sm:grid sm:grid-cols-2 sm:gap-5 sm:divide-y-0 sm:border-y-0">
              {hosts.map((host) => (
                <article key={host.name} className="py-5 first:pt-4 last:pb-4 sm:py-0">
                  <h3 className="text-2xl leading-none tracking-[-0.04em] text-ink sm:text-3xl">
                    {host.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-graphite sm:hidden">
                    {host.mobileDescription}
                  </p>
                  <p className="mt-4 hidden text-base leading-7 text-graphite sm:block">
                    {host.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-stone pt-5 md:mt-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Come say hello</p>
          <p className="text-xs text-graphite">Every Sunday · 3—5 PM</p>
        </div>
      </div>
    </section>
  );
}
