import Link from "next/link";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming events", href: "/event" },
  { label: "Gallery", href: "/gallery" },
];

const connectLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/localhoursagar/",
    external: true,
  },
  { label: "Admin", href: "/admin", external: false },
];

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "group inline-flex items-center gap-2 text-base text-ink transition-colors duration-200 hover:text-[#7a5a9e]";

  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#da8fff] transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <span
        aria-hidden
        className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {external ? "↗" : "→"}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#B790F5] px-5 pb-8 pt-16 sm:px-6 md:px-12 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Top: brand + columns */}
        <div className="grid gap-12 border-b border-stone pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#2d2640]">
              [ LocalHour / Sagar ]
            </p>
            <h2 className="mt-4 max-w-xs text-4xl font-normal leading-[0.92] tracking-[-0.05em] text-ink md:text-5xl">
              Anti
              <br />
              brain-rot.
            </h2>
            <p className="mt-5 max-w-[260px] text-sm leading-6 text-[#2d2640]">
              A social club for people who want to put the phone down and meet
              someone new.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d2640]">
              Explore
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {exploreLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d2640]">
              Connect
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {connectLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} external={l.external}>
                    {l.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d2640]">
              Visit us
            </p>
            <div className="mt-5 flex flex-col gap-3 text-base leading-6 text-ink">
              <p>
                Every Sunday
                <br />
                3:00 PM – 5:00 PM
              </p>
              <p className="text-[#2d2640]">
                Tealogy
                <br />
                Makronia, Sagar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#2d2640]">
            © {year} LocalHour. All rights reserved.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#2d2640]">
            No phones during club hours
          </p>
        </div>
      </div>
    </footer>
  );
}