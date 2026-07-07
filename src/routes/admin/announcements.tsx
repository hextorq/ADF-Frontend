import { useState } from "react";
import { useCMSStore, Announcement } from "@/store/useCMSStore";
import { Plus, Edit2, Trash2, Pin, Eye, EyeOff } from "lucide-react";

export default function AnnouncementsAdmin() {
  const { announcements, setAnnouncements } = useCMSStore();
  const [isEditing, setIsEditing] = useState<Announcement | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const toggleVisibility = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, visible: !a.visible } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Announcement Management</h2>
        <button onClick={() => setIsEditing({ id: Date.now().toString(), title: "", excerpt: "", category: "Editorial", date: new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}), priority: "Normal", to: "/announcements", pinned: false, visible: true, type: "Announcement" })} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Announcement
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Priority</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {announcements.map((ann) => (
              <tr key={ann.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 flex items-center gap-2">
                    {ann.pinned && <Pin className="h-3 w-3 text-amber-500" />}
                    {ann.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-md">{ann.excerpt}</div>
                </td>
                <td className="px-6 py-4">{ann.type} - {ann.category}</td>
                <td className="px-6 py-4">{ann.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ann.priority === 'High' ? 'bg-rose-100 text-rose-700' : ann.priority === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {ann.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleVisibility(ann.id)} className={`text-slate-400 hover:text-slate-600`} title={ann.visible ? "Hide" : "Show"}>
                      {ann.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => togglePin(ann.id)} className={`hover:text-amber-500 ${ann.pinned ? 'text-amber-500' : 'text-slate-400'}`} title="Pin">
                      <Pin className="h-4 w-4" />
                    </button>
                    <button onClick={() => setIsEditing(ann)} className="text-slate-400 hover:text-blue-600" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No announcements found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{announcements.find(a => a.id === isEditing.id) ? 'Edit Announcement' : 'Add Announcement'}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.title} onChange={e => setIsEditing({...isEditing, title: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                <textarea rows={2} className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.excerpt} onChange={e => setIsEditing({...isEditing, excerpt: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.type} onChange={e => setIsEditing({...isEditing, type: e.target.value as any})}>
                  <option value="Announcement">Announcement</option>
                  <option value="Call for Papers">Call for Papers</option>
                  <option value="Call for Chapters">Call for Chapters</option>
                  <option value="Upcoming Programmes">Upcoming Programmes</option>
                  <option value="Editorial Opportunities">Editorial Opportunities</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.category} onChange={e => setIsEditing({...isEditing, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.priority} onChange={e => setIsEditing({...isEditing, priority: e.target.value as any})}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="New">New</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link (To)</label>
                <input type="text" className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[var(--primary)] focus:outline-none" value={isEditing.to} onChange={e => setIsEditing({...isEditing, to: e.target.value})} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsEditing(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={() => {
                if(announcements.find(a => a.id === isEditing.id)) {
                  setAnnouncements(announcements.map(a => a.id === isEditing.id ? isEditing : a));
                } else {
                  setAnnouncements([...announcements, isEditing]);
                }
                setIsEditing(null);
              }} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
