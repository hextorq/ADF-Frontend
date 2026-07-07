import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE = [
  { name: "Research Journals", value: 28 },
  { name: "Book Chapters", value: 24 },
  { name: "Literary Publications", value: 18 },
  { name: "Programmes", value: 16 },
  { name: "Open Access", value: 14 },
];

const COLORS = ["#071A8C", "#22C55E", "#4FD17A", "#3B82F6", "#F59E0B"];

const ROADMAP = [
  { year: "2025", milestone: "Foundation", value: 1 },
  { year: "2026", milestone: "Expansion", value: 3 },
  { year: "2027", milestone: "New Journals", value: 6 },
  { year: "2028", milestone: "Conferences", value: 10 },
  { year: "2029", milestone: "Global Network", value: 16 },
];

const COVERAGE = [
  { area: "Science & Technology", count: 32 },
  { area: "Humanities", count: 28 },
  { area: "Social Sciences", count: 24 },
  { area: "Education", count: 22 },
  { area: "Management", count: 18 },
  { area: "Literature", count: 16 },
];

export function EcosystemCharts() {
  return (
    <section className="py-20 bg-[var(--secondary)]">
      <div className="container-academic">
        <div className="text-center max-w-2xl mx-auto">
          <div className="eyebrow justify-center">ADF Ecosystem</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">
            A connected publishing ecosystem
          </h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            Journals, edited volumes, literary works, and academic programmes —
            woven into one open-access scholarly network.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ChartCard title="ADF Ecosystem" subtitle="Distribution of activity">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={PIE}
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {PIE.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Growth Roadmap" subtitle="Cumulative initiatives by year">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ROADMAP} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#071A8C"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#22C55E" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Research Coverage" subtitle="Outputs by discipline">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={COVERAGE} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="area"
                  stroke="#475569"
                  fontSize={10}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {COVERAGE.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">{title}</h3>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
