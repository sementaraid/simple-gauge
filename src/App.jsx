import { useEffect, useState } from "react";
import { DialGauge } from "./components/DialGauge";

const randomSpeed = () => Math.random() * 200;
const randomRpm = () => 800 + Math.random() * 7000; // idle (800) up to 7800

export default function App() {
  const [speed, setSpeed] = useState(80);
  const [rpm, setRpm] = useState(2500);
  const [running, setRunning] = useState(true);

  const randomize = () => {
    setSpeed(randomSpeed());
    setRpm(randomRpm());
  };

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(randomize, 1000);
    return () => clearInterval(timer);
  }, [running]);

  return (
    <main className="dashboard">
      <div className="gauges">
        <DialGauge value={speed} min={0} max={200} unit="km/h" />
        <DialGauge
          value={rpm}
          min={0}
          max={8000}
          redline={6500}
          majorSteps={8}
          unit="x1000 r/min"
          formatLabel={(v) => Math.round(v / 1000)}
        />
      </div>
      <div className="controls">
        <button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Resume"}</button>
        <button onClick={randomize}>Random values</button>
      </div>
      <p className="hint">New random speed and RPM values are sent to the gauges every second.</p>
    </main>
  );
}
