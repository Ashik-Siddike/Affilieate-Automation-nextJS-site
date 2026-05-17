interface SpecTableProps {
  brand: string;
  modelNumber: string;
}

export default function SpecTable({ brand, modelNumber }: SpecTableProps) {
  return (
    <div className="mb-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800">Technical Specifications</h3>
      </div>
      <div className="border-t border-slate-200">
        <dl className="divide-y divide-slate-200">
          <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between bg-white hover:bg-slate-50 transition-colors">
            <dt className="text-sm font-semibold text-slate-600">Brand</dt>
            <dd className="text-sm text-slate-900 sm:col-span-2 font-bold uppercase">{brand}</dd>
          </div>
          <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
            <dt className="text-sm font-semibold text-slate-600">Model Number</dt>
            <dd className="text-sm text-slate-900 sm:col-span-2 font-bold">{modelNumber}</dd>
          </div>
          <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between bg-white hover:bg-slate-50 transition-colors">
            <dt className="text-sm font-semibold text-slate-600">Category</dt>
            <dd className="text-sm text-slate-900 sm:col-span-2 font-medium">Tactical & Sports Watch</dd>
          </div>
          <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
            <dt className="text-sm font-semibold text-slate-600">Availability</dt>
            <dd className="text-sm text-green-600 sm:col-span-2 font-bold flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              In Stock on Amazon
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
