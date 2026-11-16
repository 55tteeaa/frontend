import React, { useState, useEffect } from 'react';
import { Clock, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { apiFetch } from '../api/client';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/bookings/me');
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-xs font-bold tracking-wider text-[#3729A6] uppercase">SPAȚIUL MEU</div>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">Rezervările mele</h1>
      <p className="text-sm text-slate-500 mt-1">
        Gestionează sesiunile programate și statusul cererilor trimise administratorilor.
      </p>

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Se încarcă rezervările...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Nu ai nicio rezervare activă momentan.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase">
                <th className="py-3.5 px-6">Echipament</th>
                <th className="py-3.5 px-6">Data și intervalul</th>
                <th className="py-3.5 px-6">Scopul cercetării</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{b.resource.name}</div>
                    <div className="text-xs text-slate-400">{b.resource.location}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-800">{b.date}</div>
                    <div className="text-xs text-slate-500">
                      {String(b.startHour).padStart(2, '0')}:00–{String(b.endHour).padStart(2, '0')}:00
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 max-w-xs">{b.purpose}</td>
                  <td className="py-4 px-6">
                    {b.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobată
                      </span>
                    )}
                    {b.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        <Clock className="w-3.5 h-3.5" /> În așteptare
                      </span>
                    )}
                    {b.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                        <XCircle className="w-3.5 h-3.5" /> Respinsă
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Anulează
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}