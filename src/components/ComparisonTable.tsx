import React from 'react';

interface Product {
  name: string;
  price: string;
  rating: string;
  features: string[];
  link: string;
  isTopPick?: boolean;
}

interface ComparisonTableProps {
  products: Product[];
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-12 pb-4">
      <div className="min-w-[700px] border border-slate-200 rounded-2xl overflow-hidden shadow-lg bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-5 font-bold text-lg w-1/4">Product</th>
              <th className="p-5 font-bold text-lg w-1/6">Price</th>
              <th className="p-5 font-bold text-lg w-1/6">Rating</th>
              <th className="p-5 font-bold text-lg w-1/3">Key Features</th>
              <th className="p-5 font-bold text-lg w-1/6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${product.isTopPick ? 'bg-amber-50/30' : ''}`}
              >
                <td className="p-5 font-semibold text-slate-800">
                  {product.isTopPick && (
                    <span className="block text-[10px] uppercase tracking-wider text-amber-600 font-bold mb-1">
                      👑 Top Pick
                    </span>
                  )}
                  {product.name}
                </td>
                <td className="p-5 text-slate-600 font-medium">{product.price}</td>
                <td className="p-5 text-amber-500 font-bold tracking-widest">{product.rating}</td>
                <td className="p-5 text-slate-600 text-sm">
                  <ul className="list-disc pl-4 space-y-1">
                    {product.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </td>
                <td className="p-5 text-center">
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="nofollow sponsored"
                    className={`inline-block px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      product.isTopPick 
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
