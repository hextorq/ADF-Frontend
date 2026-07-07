import { useCMSStore } from "@/store/useCMSStore";
import { Link } from "react-router-dom";
import { FileText, Megaphone, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = useCMSStore((s) => s.statistics);
  const announcements = useCMSStore((s) => s.announcements);
  const activities = useCMSStore((s) => s.activities);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Articles" value={stats.articles} icon={FileText} color="bg-blue-500" />
        <StatCard title="Active Announcements" value={announcements.filter(a => a.visible).length} icon={Megaphone} color="bg-amber-500" />
        <StatCard title="Recent Activities" value={activities.length} icon={Activity} color="bg-emerald-500" />
        <StatCard title="Total Reviewers" value={stats.reviewers} icon={FileText} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Activities</h3>
            <Link to="/admin/activities" className="text-sm text-[var(--primary)] hover:underline">View All</Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{act.title}</p>
                    <p className="text-xs text-slate-500">{act.time} · {act.category}</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && <p className="text-sm text-slate-500">No recent activities.</p>}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Active Announcements</h3>
            <Link to="/admin/announcements" className="text-sm text-[var(--primary)] hover:underline">View All</Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {announcements.filter(a => a.visible).slice(0, 5).map((ann) => (
                <div key={ann.id} className="border-l-2 border-[var(--primary)] pl-4 py-1">
                  <p className="text-sm font-medium text-slate-900">{ann.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{ann.date} · {ann.category}</p>
                </div>
              ))}
              {announcements.filter(a => a.visible).length === 0 && <p className="text-sm text-slate-500">No active announcements.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`rounded-lg p-3 text-white ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
