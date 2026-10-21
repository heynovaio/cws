"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BLUE_ARCH, PURPLE_ARCH } from "./AnimatedLogo";

const PURPLE = "#6153a3";
const BLUE = "#1c83c6";
const DARK_BLUE = "#0056a7";

/** Final mark placement in the 1440 × 810 frame; the frame covers the full screen. */
const LOGO_SCALE = 4.6;
const LOGO_WIDTH = 90.7 * LOGO_SCALE;
const LOGO_HEIGHT = 108.1 * LOGO_SCALE;
const LOGO_X = 520 - LOGO_WIDTH / 2;
const LOGO_Y = (810 - LOGO_HEIGHT) / 2;

const ZOOM = 2.3;
const ZOOM_W = 1440 / ZOOM;
const ZOOM_H = 810 / ZOOM;
const ZOOMED_VIEWBOX = `${LOGO_X + LOGO_WIDTH / 2 - ZOOM_W / 2} ${405 - ZOOM_H / 2} ${ZOOM_W} ${ZOOM_H}`;
const FINAL_VIEWBOX = "0 0 1440 810";

const smooth = [0.65, 0, 0.35, 1] as const;
const draw = [0.45, 0, 0.25, 1] as const;
const arrive = [0.22, 1, 0.36, 1] as const;

const TIMELINE = {
  players: { delay: 0, duration: 0.8 },
  arches: { delay: 0.1, duration: 1.45 },
  middle: { delay: 1.75, duration: 0.7 },
  zoom: { delay: 2.4, duration: 1.6 },
  veil: { delay: 2.3, duration: 2.1 },
  arms: { delay: 3.65, duration: 1.2, stagger: 0.1 },
  copy: { delay: 4.5, duration: 0.9 },
};

const BRUSH_WIDTH = 14;

const BLUE_BRUSH = [
  "M92,3.7H77C62,3.7,52,7,45,13C40,17,36,22,32,27C40,35,44,44,44,54C44,64,40,73,32,81C26,85,20,86,13,86H-2",
  "M92,22.3H77C70,22.3,64.5,24,60,27C63,35,64,44,64,54C64,64,62.5,72,59.5,81C56,86,51,90,45,93.5C36,100,25,104.7,13.6,104.7H-2",
];

const PURPLE_BRUSH = [
  "M-2,3.7H13.6C28,3.7,38,7,45,13C50,17,54,21,58,26.5",
  "M-2,22.3H13.3C20,22.3,26,24,30.5,27C27,35,26,44,26,54C26,64,27,72,31,81C34,86,39,90,45,93.5C54,100,65,104.7,77,104.7H92.7",
  "M58,84C64,85.5,70,86,77.4,86H92.7",
];

const MIDDLE_BRUSH = ["M45.3,2V106"];

const OUTER_BLUE = BLUE_ARCH.filter(({ fill }) => fill !== DARK_BLUE);
const MIDDLE_BLUE = BLUE_ARCH.filter(({ fill }) => fill === DARK_BLUE);

/** The mark's arms, continued from its flat ends out to the edge of the frame. */
const ARMS: { row: number; side: "left" | "right"; color: string }[] = [
  { row: 3.7, side: "left", color: PURPLE },
  { row: 22.3, side: "left", color: PURPLE },
  { row: 86.1, side: "left", color: BLUE },
  { row: 104.7, side: "left", color: BLUE },
  { row: 3.7, side: "right", color: BLUE },
  { row: 22.3, side: "right", color: BLUE },
  { row: 86.2, side: "right", color: PURPLE },
  { row: 104.7, side: "right", color: PURPLE },
];

const timing = (
  settled: boolean,
  delay: number,
  duration: number,
  ease: readonly number[] = smooth
) =>
  settled
    ? { duration: 0 }
    : { delay, duration, ease: ease as [number, number, number, number] };

function BrushMask({
  id,
  strokes,
  width = BRUSH_WIDTH,
  ease = draw,
  offsets = [],
  delay,
  duration,
  settled,
}: {
  id: string;
  strokes: string[];
  width?: number;
  ease?: readonly number[];
  offsets?: number[];
  delay: number;
  duration: number;
  settled: boolean;
}) {
  const drawnAt = delay + Math.max(0, ...offsets) + duration;

  return (
    <mask
      id={id}
      maskUnits="userSpaceOnUse"
      x="-8"
      y="-8"
      width="110"
      height="124"
    >
      {strokes.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={width}
          strokeLinecap="butt"
          strokeLinejoin="round"
          initial={{ pathLength: settled ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={timing(
            settled,
            delay + (offsets[index] ?? 0),
            duration,
            ease
          )}
        />
      ))}
      <motion.rect
        x="-8"
        y="-8"
        width="110"
        height="124"
        fill="white"
        initial={{ opacity: settled ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={timing(settled, drawnAt, 0.2)}
      />
    </mask>
  );
}

export const HeroLogoAnimation = () => {
  const settled = Boolean(useReducedMotion());
  const uid = useId().replace(/:/g, "");
  const blueMask = `hero-blue-${uid}`;
  const purpleMask = `hero-purple-${uid}`;
  const middleMask = `hero-middle-${uid}`;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, #5a4a9a 0%, #4c5aa8 45%, #2a74b8 75%, #1a7fc4 100%)",
        }}
        initial={{ opacity: settled ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={timing(
          settled,
          TIMELINE.veil.delay,
          TIMELINE.veil.duration
        )}
      />
      <motion.svg
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        initial={{ viewBox: settled ? FINAL_VIEWBOX : ZOOMED_VIEWBOX }}
        animate={{ viewBox: FINAL_VIEWBOX }}
        transition={timing(
          settled,
          TIMELINE.zoom.delay,
          TIMELINE.zoom.duration
        )}
      >
        <defs>
          <BrushMask
            id={blueMask}
            strokes={BLUE_BRUSH}
            offsets={[0, 0.15]}
            delay={TIMELINE.arches.delay}
            duration={TIMELINE.arches.duration}
            settled={settled}
          />
          <BrushMask
            id={purpleMask}
            strokes={PURPLE_BRUSH}
            offsets={[0, 0.15, 0.6]}
            delay={TIMELINE.arches.delay}
            duration={TIMELINE.arches.duration}
            settled={settled}
          />
          <BrushMask
            id={middleMask}
            strokes={MIDDLE_BRUSH}
            width={40}
            ease={smooth}
            delay={TIMELINE.middle.delay}
            duration={TIMELINE.middle.duration}
            settled={settled}
          />
        </defs>

        {ARMS.map(({ row, side, color }, index) => {
          const y = LOGO_Y + row * LOGO_SCALE;
          const x1 = side === "left" ? LOGO_X + 4 : LOGO_X + LOGO_WIDTH - 4;
          const x2 = side === "left" ? -40 : 1480;
          return (
            <motion.line
              key={`${side}-${row}`}
              x1={x1}
              x2={x2}
              y1={y}
              y2={y}
              stroke={color}
              strokeWidth={6.8 * LOGO_SCALE}
              initial={{ pathLength: settled ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={timing(
                settled,
                TIMELINE.arms.delay + (index % 4) * TIMELINE.arms.stagger,
                TIMELINE.arms.duration,
                arrive
              )}
            />
          );
        })}

        <g transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${LOGO_SCALE})`}>
          <g mask={`url(#${purpleMask})`}>
            {PURPLE_ARCH.map((d, index) => (
              <path key={index} d={d} fill={PURPLE} />
            ))}
          </g>
          <g mask={`url(#${blueMask})`}>
            {OUTER_BLUE.map(({ d, fill }, index) => (
              <path key={index} d={d} fill={fill} />
            ))}
          </g>
          <g mask={`url(#${middleMask})`}>
            {MIDDLE_BLUE.map(({ d, fill }, index) => (
              <path key={index} d={d} fill={fill} />
            ))}
          </g>
        </g>
      </motion.svg>
    </div>
  );
};

export const HeroCopyReveal = ({ children }: { children: React.ReactNode }) => {
  const settled = Boolean(useReducedMotion());

  return (
    <motion.div
      initial={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={timing(
        settled,
        TIMELINE.copy.delay,
        TIMELINE.copy.duration,
        arrive
      )}
    >
      {children}
    </motion.div>
  );
};

export const HeroPlayers = ({ src }: { src: string }) => {
  const settled = Boolean(useReducedMotion());

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[86%] justify-center">
      <motion.img
        src={src}
        alt=""
        className="h-full w-auto max-w-none object-contain object-bottom"
        initial={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={timing(
          settled,
          TIMELINE.players.delay,
          TIMELINE.players.duration,
          arrive
        )}
      />
    </div>
  );
};
