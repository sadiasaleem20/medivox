export default function Logo({ variant = "default", size = "md" }) {
  const sizes = { sm: 32, md: 40, lg: 52 };
  const s = sizes[size];

  if (variant === "icon")
    return (
      <div
        style={{
          width: s,
          height: s,
          borderRadius: s * 0.28,
          background: "#0C447C",
        }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <svg width={s * 0.7} height={s * 0.7} viewBox="0 0 30 30">
          <polyline
            points="1,15 7,15 10,5 13,26 16,10 19,22 22,15 29,15"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  if (variant === "banner")
    return (
      <svg width="200" height="52" viewBox="0 0 200 52">
        <text
          x="0"
          y="32"
          fontFamily="Inter,sans-serif"
          fontSize="26"
          fontWeight="800"
          fill="#042C53"
          letterSpacing="-1"
        >
          MEDI
        </text>
        <text
          x="72"
          y="32"
          fontFamily="Inter,sans-serif"
          fontSize="26"
          fontWeight="300"
          fill="#185FA5"
          letterSpacing="-1"
        >
          VOX
        </text>
        <rect x="0" y="38" width="126" height="0.5" fill="#B5D4F4" />
        <polyline
          points="0,48 13,48 17,40 21,52 25,43 29,51 33,48 50,48"
          fill="none"
          stroke="#185FA5"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="54"
          y1="48"
          x2="126"
          y2="48"
          stroke="#B5D4F4"
          strokeWidth="1.2"
        />
      </svg>
    );
  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          width: s,
          height: s,
          borderRadius: s * 0.28,
          background: "#0C447C",
        }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <svg width={s * 0.7} height={s * 0.7} viewBox="0 0 30 30">
          <polyline
            points="1,15 7,15 10,5 13,26 16,10 19,22 22,15 29,15"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            style={{
              fontSize: s * 0.5,
              fontWeight: 700,
              color: "#0C447C",
              letterSpacing: "-0.5px",
            }}
          >
            Medi
          </span>
          <span
            style={{
              fontSize: s * 0.5,
              fontWeight: 300,
              color: "#1D9E75",
              letterSpacing: "-0.5px",
            }}
          >
            vox
          </span>
        </div>
        {size === "lg" && (
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "#888780",
              fontWeight: 500,
            }}
          >
            AI HEALTH PLATFORM
          </span>
        )}
      </div>
    </div>
  );
}
