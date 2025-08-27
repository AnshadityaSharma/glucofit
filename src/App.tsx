// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import anime from "animejs/lib/anime.es.js";
import PersonaTabs from "./components/PersonaTabs";
import Calculator from "./components/Calculator";
import FoodSuggestions from "./components/FoodSuggestions";
import ActivityTracker from "./components/ActivityTracker";
import ActivityChart from "./components/ActivityChart";
import CalorieProgress from "./components/CalorieProgress";
import Onboarding from "./components/Onboarding";
import { personaThemes, GlobalStyle } from "./theme";
import InfoCard, { GlobalSpotlight } from "./components/InfoCard";

/* Shell layout + persona background
   - shellRef used for GlobalSpotlight area detection
*/
const Shell = styled.div`
  max-width: 1200px;
  margin: 32px auto;
  padding: 24px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  box-shadow: 0 10px 40px rgba(2,6,23,0.6);
  position: relative;
  overflow: hidden;
`;

const PersonaBG = styled.div<{ persona: string }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.14;
  background: ${({ persona, theme }) => {
    switch (persona) {
      case "diabetic-male":
        return `radial-gradient(600px 300px at 10% 10%, ${theme.accent}33, transparent), linear-gradient(180deg, ${theme.panel} 0%, ${theme.bg} 100%)`;
      case "diabetic-female":
        return `radial-gradient(600px 300px at 90% 10%, ${theme.accent}22, transparent), linear-gradient(180deg, ${theme.panel} 0%, ${theme.bg} 100%)`;
      case "normal-male":
        return `radial-gradient(600px 300px at 10% 90%, ${theme.accent}33, transparent), linear-gradient(180deg, ${theme.panel} 0%, ${theme.bg} 100%)`;
      default:
        return `radial-gradient(600px 300px at 90% 90%, ${theme.accent}22, transparent), linear-gradient(180deg, ${theme.panel} 0%, ${theme.bg} 100%)`;
    }
  }};
`;

export default function App() {
  const [persona, setPersona] = useState<
    "diabetic-male" | "diabetic-female" | "normal-male" | "normal-female"
  >("diabetic-male");
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: ".fade-in",
        translateY: [16, 0],
        opacity: [0, 1],
        delay: anime.stagger(60),
      });
  }, []);

  const theme = useMemo(() => personaThemes[persona], [persona]);

  const renderPersonaMenu = () => {
    if (persona.startsWith("diabetic")) {
      return (
        <>
          <button
            onClick={() =>
              alert(
                "Glycemic control tips:\n- Prefer low-GI carbs\n- Pair carbs with protein\n- Walk 10–20 min after meals"
              )
            }
            style={{ background: "transparent", color: "var(--accent)" }}
          >
            Glycemic Tips
          </button>

          <button
            onClick={() =>
              alert(
                "Carb Guide:\n- Choose whole grains\n- Avoid sugary drinks\n- Control portions"
              )
            }
            style={{ background: "transparent" }}
          >
            Carb Guide
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={() =>
            alert(
              "Quick workouts:\n- 20m HIIT\n- 30m brisk walk\n- 3x strength sets per week"
            )
          }
          style={{ background: "transparent", color: "var(--accent)" }}
        >
          Workouts
        </button>

        <button
          onClick={() =>
            alert(
              "Diet plans:\n- Balanced macros\n- Protein-forward meals\n- Track portion sizes"
            )
          }
          style={{ background: "transparent" }}
        >
          Diet Plans
        </button>
      </>
    );
  };

  // Helper: convert hex accent to "r,g,b" so GlobalSpotlight uses theme accent
  const hexToRgbString = (hex: string) => {
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(short, (_m, r, g, b) => r + r + g + g + b + b);
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!match) return "132, 0, 255";
    return `${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Shell className="app-shell fade-in" ref={shellRef}>
        <PersonaBG persona={persona} aria-hidden="true" />

        {/* Global spotlight — applies to all .infocard-container inside shellRef */}
        <GlobalSpotlight rootRef={shellRef} radius={320} glowColor={hexToRgbString(theme.accent)} />

        {/* header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>GlucoFit Pro</h1>
            <div style={{ color: theme.muted }}>Multiple faces • Diabetes & Standard • Activity & Food</div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", zIndex: 1 }}>
            <div style={{ display: "flex", gap: 8 }}>{renderPersonaMenu()}</div>

            <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
              <small style={{ color: theme.muted, alignSelf: "center" }}>Persona</small>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as any)}
                aria-label="Select persona"
                style={{ padding: 8, borderRadius: 8, border: 0, background: "transparent", color: "inherit" }}
              >
                <option value="diabetic-male">Diabetic • Male</option>
                <option value="diabetic-female">Diabetic • Female</option>
                <option value="normal-male">Normal • Male</option>
                <option value="normal-female">Normal • Female</option>
              </select>
            </div>

            <button onClick={() => setShowOnboarding((s) => !s)} aria-pressed={showOnboarding}>
              {showOnboarding ? "Close" : "Onboarding"}
            </button>
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 1 }}>
          {/* PersonaTabs itself wrapped so the spotlight and effects can appear around it */}
          <InfoCard glowColor={hexToRgbString(theme.accent)} enableTilt={false} enableMagnetism={false}>
            <PersonaTabs value={persona} onChange={setPersona} />
          </InfoCard>

          {showOnboarding && (
            <div style={{ marginTop: 12 }}>
              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <Onboarding
                  persona={persona}
                  onApply={(payload) => {
                    setTargetCalories(payload.target);
                    setShowOnboarding(false);
                  }}
                />
              </InfoCard>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <Calculator persona={persona} onTargetChange={setTargetCalories} />
              </InfoCard>

              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <FoodSuggestions persona={persona} />
              </InfoCard>

              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <ActivityChart />
              </InfoCard>
            </div>

            <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <CalorieProgress target={targetCalories} />
              </InfoCard>

              <InfoCard glowColor={hexToRgbString(theme.accent)}>
                <ActivityTracker persona={persona} />
              </InfoCard>
            </aside>
          </div>
        </main>
      </Shell>
    </ThemeProvider>
  );
}
