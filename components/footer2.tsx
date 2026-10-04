import Link from "next/link";

const explore = [
  { label: "Home", href: "/" },
  { label: "Upcoming events", href: "/event" },
  { label: "Gallery", href: "/gallery" },
];

const connect = [
  { label: "Instagram", href: "https://www.instagram.com/localhoursagar/", external: true },
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
  const cls =
    "group inline-flex items-center gap-2 text-base text-[#2d2640]/80 transition-colors duration-200 hover:text-[#fcf8ec]";
  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {external ? "↗" : "→"}
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export default function Footer2() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-[#b28ff3] text-[#2d2640]">
      {/* Top */}
      <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        {/* Headline */}
        <div className="px-5 py-12 sm:px-6 md:px-12 md:py-16">
          <h2 className="max-w-md text-4xl font-medium leading-[0.95] tracking-[-0.05em] md:text-6xl">
            Put the phone down. Meet someone new.
          </h2>
        </div>

        {/* Explore */}
        <div className="border-t border-[#2d2640]/30 px-5 py-8 sm:px-6 md:border-l md:border-t-0 md:px-8 md:py-16">
          <h3 className="text-2xl font-medium tracking-[-0.03em]">Explore</h3>
          <ul className="mt-6 flex flex-col gap-3">
            {explore.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="border-t border-[#2d2640]/30 px-5 py-8 sm:px-6 md:border-l md:border-t-0 md:px-8 md:py-16">
          <h3 className="text-2xl font-medium tracking-[-0.03em]">Connect</h3>
          <ul className="mt-6 flex flex-col gap-3">
            {connect.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href} external={l.external}>
                  {l.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Visit */}
        <div className="border-t border-[#2d2640]/30 px-5 py-8 sm:px-6 md:border-l md:border-t-0 md:px-8 md:py-16">
          <h3 className="text-2xl font-medium tracking-[-0.03em]">Visit us</h3>
          <div className="mt-6 flex flex-col gap-4 text-base leading-6 text-[#2d2640]/80">
            <p>
              Every Sunday
              <br />
              3:00 PM – 5:00 PM
            </p>
            <p>
              Tealogy
              <br />
              Makronia, Sagar
            </p>
          </div>
        </div>
      </div>

      {/* Big wordmark */}
      <div className="border-t border-[#2d2640]/30 px-5 py-10 sm:px-6 md:px-12 md:py-14">
        <p
          aria-hidden
          className="whitespace-nowrap text-center font-mono text-[14.5vw] font-bold uppercase leading-none tracking-[-0.04em] text-[#2d2640]"
        >
          Local-Hour
        </p>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-2 px-5 pb-8 text-center text-xs text-[#2d2640]/70 sm:px-6 md:flex-row md:justify-between md:px-12 md:text-left">
        <p>© {year} Local-Hour. All rights reserved.</p>
        <p className="font-mono uppercase tracking-[0.16em]">
          No phones during club hours
        </p>
      </div>
    </footer>
  );
}