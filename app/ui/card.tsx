import { ArrowUpRight } from "lucide-react";

interface CardInfo {
  heading: string;
  subHeading: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export default function InfoCard({
  heading,
  subHeading,
  description,
  image,
  onClick,
}: CardInfo) {
  return (
    <div className="group flex h-[480px] w-[320px] flex-col overflow-hidden rounded-2xl border border-ink bg-ink text-paper transition duration-300 hover:-translate-y-1 hover:border-graphite">

      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-graphite">
        <img
          src={image}
          alt={heading}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Gradient over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>


      {/* Content */}
      <div className="flex flex-1 flex-col p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-stone">
          {subHeading}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {heading}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-fog">
          {description}
        </p>


        {/* Bottom button */}
        <div className="mt-auto pt-5">
          <button
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-xl border border-stone px-4 py-3 text-sm font-medium transition hover:bg-paper hover:text-ink"
          >
            Learn more

            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>

      </div>
    </div>
  );
}
