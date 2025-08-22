// src/components/SunChart.jsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function SunChart({ rows }) {
  if (!rows || rows.length === 0) return null;

  // Map to chart-friendly data
  const data = rows.map(d => ({
    date: d.date,
    sunrise: timeToMinutes(d.sunrise),
    sunset: timeToMinutes(d.sunset),
    goldenStart: timeToMinutes(d.goldenHourStart),
    goldenEnd: timeToMinutes(d.goldenHourEnd),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-300 dark:stroke-neutral-700" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 1440]} // minutes in a day
            tickFormatter={(v) => minutesToHHMM(v)}
          />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value, name) => [minutesToHHMM(value), name]}
          />
          <Legend />
          <Line type="monotone" dataKey="sunrise" stroke="#3b82f6" name="Sunrise" />
          <Line type="monotone" dataKey="sunset" stroke="#f97316" name="Sunset" />
          <Line type="monotone" dataKey="goldenStart" stroke="#facc15" name="Golden Hour Start" />
          <Line type="monotone" dataKey="goldenEnd" stroke="#eab308" name="Golden Hour End" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function timeToMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
