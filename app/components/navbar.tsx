import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 border-y border-stone bg-paper text-ink">
      <div className="mx-auto flex h-full items-center justify-between px-8">
        
        {/* Logo */}
        <Link href="/" className="text-xs">
          localHour
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-10 text-xs">
          <Link href="/event" className="hover:text-graphite">
            Events
          </Link>

          <Link href="/gallery" className="hover:text-graphite">
            Gallery
          </Link>

          <Link href="/join" className="hover:text-graphite">
            Join
          </Link>
        </div>

      </div>
    </nav>
  );
}
