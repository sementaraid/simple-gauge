# Simple Gauge

A car-style dial gauge component for React, shown as a speedometer and an engine RPM gauge side by side. The needles follow random values every second.

## Run it locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Run it with Docker

The image builds the site, then serves the static files with nginx on port 80.

```bash
docker build -t simple-gauge .
docker run -d -p 8080:80 --name simple-gauge simple-gauge
```

Then open http://localhost:8080. To use another port, change the first number, for example `-p 3000:80`.

## Using the component

The gauge lives in `src/components/DialGauge.jsx`.

```jsx
import { DialGauge } from "./components/DialGauge";

// Speedometer
<DialGauge value={speed} min={0} max={200} unit="km/h" />

// Engine RPM
<DialGauge
  value={rpm}
  max={8000}
  redline={6500}
  majorSteps={8}
  unit="x1000 r/min"
  formatLabel={(v) => Math.round(v / 1000)}
/>
```

| Prop | Default | What it does |
| --- | --- | --- |
| `value` | | Current value; kept between `min` and `max` |
| `min` / `max` | `0` / `200` | Range of the dial |
| `redline` | 80% of the range | Where the red zone starts |
| `majorSteps` | `10` | Number of numbered sections |
| `size` | `280` | Width and height in px |
| `unit` | `"km/h"` | Label on the dial face |
| `formatLabel` | rounded value | Text for each number on the dial |
| `formatValue` | rounded value | Text in the digital readout |
