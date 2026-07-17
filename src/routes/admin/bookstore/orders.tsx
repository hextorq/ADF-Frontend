export default function OrderManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order Management</h2>
          <p className="text-sm text-slate-500">Track and manage bookstore orders and payments.</p>
        </div>
      </div>
      <div className="border border-slate-200 rounded-md p-8 text-center text-slate-500">
        Order data table goes here...
      </div>
    </div>
  );
}
