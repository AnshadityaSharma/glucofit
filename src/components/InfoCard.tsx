// src/components/InfoCard.tsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";

/**
 * InfoCard
 * - Wrap any existing component markup with <InfoCard> ... </InfoCard>
 * - Provides: tilt (time-limited), magnetism, border glow (driven by GlobalSpotlight), click ripple,
 *   and CSS variables for glow position/intensity.
 *
 * Tilt behavior:
 *  - Tilt is active for exactly TILT_ACTIVE_MS milliseconds after mouseenter.
 *  - After that window ends, tilt is disabled until the card is left and re-entered.
 *  - Glow and other effects are unaffected.
 */

const Container = styled.div`
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 220px;
  --glow-color: 132, 0, 255; /* default RGB; overridden inline from theme when used */

  position: relative;
  border-radius: 14px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.03);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transition: box-shadow 0.22s ease, transform 0.15s ease;

  /* Card border glow pseudo-element (uses CSS vars updated from JS) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    padding: 6px;
    border-radius: inherit;
    pointer-events: none;
    z-index: 2;
    background: radial-gradient(
      var(--glow-radius) circle at var(--glow-x) var(--glow-y),
      rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%,
      rgba(var(--glow-color), calc(var(--glow-intensity) * 0.35)) 30%,
      transparent 60%
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0.95;
    transition: opacity 0.22s ease;
  }

  &:hover {
    box-shadow: 0 8px 30px rgba(2,6,23,0.45);
  }

  .infocard-inner {
    position: relative;
    z-index: 3;
  }
`;

/** Utility: clamp tilt magnitude for smaller cards */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Duration (ms) tilt remains active after mouseenter */
const TILT_ACTIVE_MS = 1000;

export const InfoCard: React.FC<
  React.PropsWithChildren<{
    glowColor?: string;
    enableTilt?: boolean;
    enableMagnetism?: boolean;
    clickEffect?: boolean;
    disableOnMobile?: boolean;
  }>
> = ({
  children,
  glowColor = "132, 0, 255",
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  disableOnMobile = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const tiltWindowTimeout = useRef<number | null>(null);
  const tiltActive = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial glow color on the element
    el.style.setProperty("--glow-color", glowColor);

    // Abort on mobile if requested
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    if (disableOnMobile && isMobile) {
      return;
    }

    const resetTiltSmooth = (duration = 400) => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: duration / 1000, ease: "power2.out" });
    };

    const startTiltWindow = () => {
      // enable tilt for the window
      tiltActive.current = true;
      // clear any existing timer
      if (tiltWindowTimeout.current != null) {
        window.clearTimeout(tiltWindowTimeout.current);
        tiltWindowTimeout.current = null;
      }
      // set timeout to disable tilt after TILT_ACTIVE_MS
      tiltWindowTimeout.current = window.setTimeout(() => {
        tiltActive.current = false;
        // when tilt window ends, ease the card back to flat
        resetTiltSmooth(400);
        tiltWindowTimeout.current = null;
      }, TILT_ACTIVE_MS);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Glow origin (CSS vars used by ::after)
      const relX = ((x / rect.width) * 100).toFixed(2) + "%";
      const relY = ((y / rect.height) * 100).toFixed(2) + "%";
      el.style.setProperty("--glow-x", relX);
      el.style.setProperty("--glow-y", relY);

      // Only apply tilt while tiltActive is true (i.e., within the window after mouseenter)
      if (enableTilt && tiltActive.current) {
        const rotateX = clamp(((y - centerY) / centerY) * -6, -12, 12);
        const rotateY = clamp(((x - centerX) / centerX) * 6, -12, 12);
        gsap.to(el, { rotateX, rotateY, duration: 0.12, ease: "power2.out", transformPerspective: 900 });
      }

      // Magnetism still follows while moving (optional behavior)
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04;
        const magnetY = (y - centerY) * 0.04;
        animRef.current?.kill();
        animRef.current = gsap.to(el, { x: magnetX, y: magnetY, duration: 0.28, ease: "power2.out" });
      }
    };

    const handleMouseEnter = () => {
      // start small scale on enter
      gsap.to(el, { scale: 1.01, duration: 0.18, ease: "power2.out" });
      // start a fresh tilt window — tilt will be active for TILT_ACTIVE_MS even if the pointer doesn't move
      startTiltWindow();
    };

    const handleMouseLeave = () => {
      // clear tilt window and make sure tilt is disabled until next enter
      if (tiltWindowTimeout.current != null) {
        window.clearTimeout(tiltWindowTimeout.current);
        tiltWindowTimeout.current = null;
      }
      tiltActive.current = false;

      // smoothly reset transforms and position
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1, duration: 0.35, ease: "power2.out" });

      // Note: We DO NOT alter --glow-intensity here — GlobalSpotlight controls persistent glow.
    };

    const handleClick = (ev: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position:absolute;
        left:${x - maxDistance}px;
        top:${y - maxDistance}px;
        width:${maxDistance * 2}px;
        height:${maxDistance * 2}px;
        pointer-events:none;
        border-radius:50%;
        z-index: 100;
        background: radial-gradient(circle, rgba(${glowColor}, 0.36) 0%, rgba(${glowColor},0.18) 30%, transparent 70%);
        transform: scale(0);
      `;
      el.appendChild(ripple);

      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", handleClick);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("click", handleClick);
      animRef.current?.kill();
      if (tiltWindowTimeout.current != null) {
        window.clearTimeout(tiltWindowTimeout.current);
        tiltWindowTimeout.current = null;
      }
    };
  }, [glowColor, enableTilt, enableMagnetism, clickEffect, disableOnMobile]);

  return (
    <Container ref={ref} className="infocard-container" aria-live="polite">
      <div className="infocard-inner">{children}</div>
    </Container>
  );
};

/**
 * GlobalSpotlight
 * - Append a single fixed radial spotlight that follows the mouse when within the given rootRef.
 * - Finds all `.infocard-container` children and sets their --glow-intensity based on distance.
 *
 * (unchanged behavior — glow is independent from tilt)
 */
export const GlobalSpotlight: React.FC<{
  rootRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  glowColor?: string; // "r,g,b"
  disableOnMobile?: boolean;
}> = ({ rootRef, radius = 300, glowColor = "132, 0, 255", disableOnMobile = true }) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef?.current;
    if (!root) return;

    let isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    if (disableOnMobile && isMobile) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: ${radius * 2}px;
      height: ${radius * 2}px;
      left: 0;
      top: 0;
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle,
        rgba(${glowColor},0.18) 0%,
        rgba(${glowColor},0.08) 25%,
        rgba(${glowColor},0.03) 50%,
        transparent 70%);
      mix-blend-mode: screen;
      opacity: 0;
      transition: opacity 0.18s ease;
      will-change: left, top, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const proximity = radius * 0.45;
    const fadeDistance = radius * 0.85;

    const handleMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;

      const rect = root.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: "power2.out" });
        root.querySelectorAll<HTMLElement>(".infocard-container").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.08, ease: "power2.out" });

      let minDist = Infinity;
      root.querySelectorAll<HTMLElement>(".infocard-container").forEach((c) => {
        const cRect = c.getBoundingClientRect();
        const cx = cRect.left + cRect.width / 2;
        const cy = cRect.top + cRect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cRect.width, cRect.height) / 2;
        const eff = Math.max(0, dist);
        minDist = Math.min(minDist, eff);

        let intensity = 0;
        if (eff <= proximity) intensity = 1;
        else if (eff <= fadeDistance) intensity = (fadeDistance - eff) / (fadeDistance - proximity);
        else intensity = 0;

        c.style.setProperty("--glow-intensity", `${Number(intensity.toFixed(2))}`);
      });

      const targetOpacity = minDist <= proximity ? 0.9 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.9 : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: 0.12, ease: "power2.out" });
    };

    const handleLeave = () => {
      if (!spotlightRef.current) return;
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.28, ease: "power2.out" });
      root.querySelectorAll<HTMLElement>(".infocard-container").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      spotlightRef.current?.remove();
    };
  }, [rootRef, radius, glowColor, disableOnMobile]);

  return null;
};

export default InfoCard;
