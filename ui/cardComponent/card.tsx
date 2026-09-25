type EventCardProps = {
  day?: string;
  month?: string;
  title?: string;
  time?: string;
  venue?: string;
  fee?: string;
  tag?: string;
  buttonText?: string;
  image?: string;
  cardBackground?: string;
  dateBadgeBackground?: string;
  dateTextColor?: string;
  buttonBackground?: string;
  buttonTextColor?: string;
  infoBackground?: string;
  infoTextColor?: string;
  className?: string;
};

export default function EventCard({
  day = "21",
  month = "SEP",
  title = "Open Jam",
  time = "4:16 PM",
  venue = "Cafe Corner, Sagar",
  fee = "₹49/-",
  tag = "CAFE",
  buttonText = "Register Now",
  image =
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  cardBackground = "#dfe5e6",
  dateBadgeBackground = "#f7f4ef",
  dateTextColor = "#1b1a1a",
  buttonBackground = "#1f1d1a",
  buttonTextColor = "#f8f3ed",
  infoBackground = "#f5f1ec",
  infoTextColor = "#1f1d1a",
  className = "",
}: EventCardProps) {
  return (
    <div
      className={`w-[360px] overflow-hidden rounded-[26px] border border-[#1f1d1a] bg-[#1f1d1a] shadow-[0_18px_45px_rgba(0,0,0,0.15)] ${className}`}
      style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
    >
      <div className="relative h-[260px] overflow-hidden border-b border-[#1f1d1a] bg-[#c7c7c7]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
            filter: "saturate(0.9) contrast(1.08)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_50%)]" />

        <div className="absolute left-4 top-4 rounded-[18px] border border-[#1f1d1a]
         bg-white/55 px-3 py-2 shadow-[4px_4px_0_rgba(26,22,18,0.08)] backdrop-blur-[2px]" style={{ backgroundColor: dateBadgeBackground }}>
          
          <div className="text-center leading-none">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: dateTextColor }}>
              {month}
            </div>
            <div className="mt-1 text-[36px] font-medium leading-none tracking-[-0.07em]" style={{ color: dateTextColor }}>
              {day}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1d1a] text-[18px] font-medium shadow-[4px_4px_0_rgba(26,22,18,0.08)]"
          style={{ backgroundColor: infoBackground, color: infoTextColor }}
          aria-label="More info"
        >
          i
        </button>
      </div>

      <div className="px-5 pb-5 pt-4" style={{ backgroundColor: cardBackground }}>
        <div className="mb-3 inline-flex rounded-full border border-[#1f1d1a]/70 bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#1f1d1a]">
          {tag}
        </div>

        <h3 className="text-[52px] font-medium leading-[0.9] tracking-[-0.08em] text-[#1f1d1a]">
          {title}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[18px] font-medium text-[#1f1d1a]">{time}</p>
          <span
            className="rounded-full border border-[#1f1d1a] px-2.5 py-1 text-[15px] font-medium text-[#1f1d1a]"
            style={{ backgroundColor: infoBackground }}
          >
            {fee}
          </span>
        </div>

        <p className="mt-2 text-[16px] text-[#3b3a39]">{venue}</p>

        <button
          type="button"
          className="mt-5 w-full rounded-[14px] border border-[#1f1d1a] px-4 py-3 text-[16px] font-medium shadow-[4px_4px_0_rgba(26,22,18,0.08)] transition-transform duration-200 hover:scale-[1.01]"
          style={{ backgroundColor: buttonBackground, color: buttonTextColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
