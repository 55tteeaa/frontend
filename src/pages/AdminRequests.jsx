import React, { useState, useEffect } from 'react';
import { Inbox, Layers, Calendar, Check, X, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '../api/client';

export default function AdminRequests({ mode = 'PENDING' }) {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    uniqueResourcesCount: 0,
    departmentsCount: 0,
    nextBooking: null,
  });
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/bookings/admin?status=${mode}`);
      setRequests(data.requests);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [mode]);

  const handleDecision = async (id, status) => {
    await apiFetch(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    loadRequests();
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const formatRoDate = (dateStr) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    return `${parseInt(d, 10)} ${m === '11' ? 'noiembrie' : 'octombrie'} 2026`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xs font-bold tracking-wider text-[#3729A6] uppercase">
        ADMINISTRAREA RESURSELOR
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">
        {mode === 'HISTORY' ? 'Istoric cereri' : 'Cereri în așteptare'}
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Analizează solicitările de acces și gestionează rezervările resurselor de cercetare.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] text-[#1D1464] flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.pendingCount}</span>
              <span className="text-sm font-semibold text-slate-700">Cereri de analizat</span>
            </div>
            <div className="text-xs text-slate-400">În așteptarea aprobării</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] text-[#1D1464] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.uniqueResourcesCount}</span>
              <span className="text-sm font-semibold text-slate-700">Resurse solicitate</span>
            </div>
            <div className="text-xs text-slate-400">Din {stats.departmentsCount} departamente</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] text-[#1D1464] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">27 oct.</span>
              <span className="text-sm font-semibold text-slate-700">Următoarea rezervare</span>
            </div>
            <div className="text-xs text-slate-400">Marți, de la ora 09:00</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">Solicitări de rezervare</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#1D1464] text-xs font-semibold">
              {requests.length} {mode === 'HISTORY' ? 'în istoric' : 'în așteptare'}
            </span>
          </div>
          <span className="text-xs text-slate-400">Actualizat astăzi, 26 octombrie • 08:30</span>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Se încarcă solicitările...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Nu există solicitări în această secțiune.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                  <th className="py-3.5 px-6">Nume Student</th>
                  <th className="py-3.5 px-6">Echipament solicitat</th>
                  <th className="py-3.5 px-6">Dată/Oră</th>
                  <th className="py-3.5 px-6">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {getInitials(req.user.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{req.user.name}</div>
                          <div className="text-xs text-slate-400">{req.user.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{req.resource.name}</div>
                      <div className="text-xs text-slate-400">{req.resource.location}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{formatRoDate(req.date)}</div>
                      <div className="text-xs text-slate-400">
                        {String(req.startHour).padStart(2, '0')}:00–
                        {String(req.endHour).padStart(2, '0')}:00
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {mode === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecision(req.id, 'APPROVED')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1D1464] hover:bg-[#2A1E85] text-white text-xs font-semibold transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Aprobă
                          </button>
                          <button
                            onClick={() => handleDecision(req.id, 'REJECTED')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 text-xs font-semibold transition"
                          >
                            <X className="w-3.5 h-3.5" /> Respinge
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {req.status === 'APPROVED' ? 'Aprobată' : 'Respinsă'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>
            Se afișează {requests.length} din {requests.length} cereri
          </span>
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Pagina 1 din 1</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <Mail className="w-4 h-4 text-slate-400" />
        <span>Studenții primesc o notificare prin e-mail după aprobarea sau respingerea cererii.</span>
      </div>
    </div>
  );
}