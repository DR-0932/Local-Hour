import Link from "next/link";

const navItems = [
  { href: "/event", label: "Events" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  return (
    <header className="w-full ">
      <nav className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 bg-paper">
        <Link href="/" className="text-md font-medium uppercase tracking-wide text-black">
          localHour
        </Link>

        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-md text-black hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
