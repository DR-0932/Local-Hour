const icons = [
  { src: "/icons/instagram.png", alt: "Instagram", left: "12%", top: "18%", rotate: -18 },
  { src: "/icons/facebook.png", alt: "Facebook", left: "25%", top: "12%", rotate: 12 },
  { src: "/icons/telegram.png", alt: "Telegram", left: "74%", top: "18%", rotate: -12 },
  { src: "/icons/youtube.png", alt: "YouTube", left: "82%", top: "34%", rotate: 18 },
  { src: "/icons/twitter.png", alt: "Twitter", left: "18%", top: "72%", rotate: 16 },
  { src: "/icons/threads.png", alt: "Threads", left: "66%", top: "70%", rotate: -14 },
  { src: "/icons/snapchat.png", alt: "Snapchat", left: "48%", top: "82%", rotate: 10 },
  { src: "/icons/instagram.png", alt: "Instagram Accent", left: "48%", top: "12%", rotate: -24 },
  { src: "/icons/telegram.png", alt: "Telegram Accent", left: "72%", top: "48%", rotate: 20 },
  { src: "/icons/youtube.png", alt: "YouTube Accent", left: "30%", top: "58%", rotate: -20 },
];

export default function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {icons.map((icon, index) => (
        <img
          key={`${icon.alt}-${index}`}
          src={icon.src}
          alt={icon.alt}
          className="floating-icon absolute h-12 w-12 object-contain opacity-70 md:h-14 md:w-14"
          style={{
            left: icon.left,
            top: icon.top,
            transform: `rotate(${icon.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
