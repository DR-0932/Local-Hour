
export default function HeroSection() {
  return (
    <section className="bg-paper px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-36 lg:px-16">
      {/* <WaterDropGrid/> */}

      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-graphite">
          localHour / Sagar
        </p>

        <h1 className="mt-7 max-w-5xl text-[clamp(4.5rem,13vw,11rem)] font-semibold leading-[0.78] tracking-[-0.09em] text-ink">
          Less scrolling.
          <br />
          More living.
        </h1>

        <p className="mt-10 max-w-md text-lg leading-8 text-graphite sm:text-xl">
          A few good hours, spent properly.
        </p>
      </div>
    </section>
  );
}
