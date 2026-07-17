export default function BookManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Book Management</h2>
          <p className="text-sm text-slate-500">Add, edit, or delete books from the store.</p>
        </div>
        <button className="bg-slate-950 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">
          Add New Book
        </button>
      </div>
      <div className="border border-slate-200 rounded-md p-8 text-center text-slate-500">
        Book data table goes here...
      </div>
    </div>
  );
}
