import { useId } from "react";

/**
 * DialGauge — a car-style dial: dark face, white markings,
 * red zone at the top end, and a needle that rotates to `value`.
 * Use it for a speedometer, a tachometer (RPM), or anything similar.
 *
 * Props:
 *   value        number    current value (clamped to min..max)
 *   min          number    default 0
 *   max          number    default 200
 *   redline      number    where the red zone starts, default 80% of max
 *   majorSteps   number    how many numbered sections the dial has, default 10
 *   size         number    width/height in px, default 280
 *   unit         string    label on the dial face, default "km/h"
 *   formatLabel  (v) => string   text for each numbered tick, default rounded value
 *   formatValue  (v) => string   text in the digital readout, default rounded value
 */
export function DialGauge({
  value,
  min = 0,
  max = 200,
  redline,
  majorSteps = 10,
  size = 280,
  unit = "km/h",
  formatLabel = (v) => Math.round(v),
  formatValue = (v) => Math.round(v),
}) {
  // Unique ids so several gauges on one page don't share gradients
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;

  const START = -135; // angle (deg) at min
  const END = 135;    // angle (deg) at max
  const red = redline ?? min + (max - min) * 0.8;
  const clamped = Math.min(max, Math.max(min, value));
  const toAngle = (v) => START + ((v - min) / (max - min)) * (END - START);
  const angle = toAngle(clamped);

  const c = 100; // SVG center (viewBox is 200x200)
  const r = 84;  // radius of the tick ring

  // Point on the circle for an angle measured clockwise from 12 o'clock
  const polar = (deg, radius) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + radius * Math.cos(rad), c + radius * Math.sin(rad)];
  };

  const arcPath = (fromDeg, toDeg, radius) => {
    const [x1, y1] = polar(fromDeg, radius);
    const [x2, y2] = polar(toDeg, radius);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Major ticks with numbers, plus 4 minor ticks between each pair
  const minorPerMajor = 5;
  const total = majorSteps * minorPerMajor;
  const ticks = [];
  for (let i = 0; i <= total; i++) {
    const v = min + (i / total) * (max - min);
    const deg = toAngle(v);
    const major = i % minorPerMajor === 0;
    const color = v >= red ? "#ff3b30" : "#ffffff";
    const [x1, y1] = polar(deg, r);
    const [x2, y2] = polar(deg, r - (major ? 12 : 6));
    ticks.push(
      <line key={`t${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={major ? 2.5 : 1} strokeLinecap="round" />
    );
    if (major) {
      const [lx, ly] = polar(deg, r - 23);
      ticks.push(
        <text key={`l${i}`} x={lx} y={ly} fontSize="10" fontWeight="600"
          textAnchor="middle" dominantBaseline="central" fill={color}
          fontFamily="system-ui, sans-serif">
          {formatLabel(v)}
        </text>
      );
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id={id("bezel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6e8eb" />
          <stop offset="0.5" stopColor="#8a8f96" />
          <stop offset="1" stopColor="#3a3d42" />
        </linearGradient>
        <radialGradient id={id("face")} cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#2a2d33" />
          <stop offset="1" stopColor="#0b0c0e" />
        </radialGradient>
        <radialGradient id={id("hub")} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9aa0a8" />
          <stop offset="1" stopColor="#1c1e22" />
        </radialGradient>
      </defs>

      {/* Metal rim and dark face */}
      <circle cx={c} cy={c} r="99" fill={`url(#${id("bezel")})`} />
      <circle cx={c} cy={c} r="93" fill={`url(#${id("face")})`} />

      {/* Red zone band */}
      <path d={arcPath(toAngle(red), END, r + 3)} fill="none" stroke="#ff3b30" strokeWidth="3" />

      {ticks}

      <text x={c} y={c - 30} fontSize="8" textAnchor="middle" fill="#9aa0a8"
        fontFamily="system-ui, sans-serif" letterSpacing="1">
        {unit}
      </text>

      {/* Digital readout */}
      <rect x={c - 24} y={c + 30} width="48" height="20" rx="3" fill="#000" stroke="#33363c" />
      <text x={c} y={c + 41} fontSize="13" fontWeight="700" textAnchor="middle"
        dominantBaseline="central" fill="#ffffff" fontFamily="ui-monospace, monospace">
        {formatValue(clamped)}
      </text>

      {/* Needle: drawn pointing straight up, then rotated around the center */}
      <g style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: `${c}px ${c}px`,
        transition: "transform 0.6s cubic-bezier(.4,1.6,.6,1)",
      }}>
        <polygon points={`${c - 2.5},${c + 14} ${c + 2.5},${c + 14} ${c + 1},${c - 78} ${c - 1},${c - 78}`}
          fill="#ff5a1f" style={{ filter: "drop-shadow(0 0 2px rgba(255,90,31,.8))" }} />
      </g>
      <circle cx={c} cy={c} r="9" fill={`url(#${id("hub")})`} stroke="#000" strokeWidth="1" />
    </svg>
  );
}
