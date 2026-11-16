import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, Clock, ArrowUpRight, Info } from 'lucide-react';
import { apiFetch } from '../api/client';

export default function HomeCatalog() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [equipmentType, setEquipmentType] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [sort, setSort] = useState('recommended');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          department,
          equipmentType,
          sort,
        });
        const data = await apiFetch(`/resources?${params.toString()}`);
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [search, department, equipmentType, sort]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xs font-bold tracking-wider text-[#3729A6] uppercase">
        RESURSE DE CERCETARE
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">
        Găsește resursa pentru următoarea idee.
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Explorează echipamentele universității și rezervă timpul de care ai nevoie pentru cercetare.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută după nume sau cuvânt-cheie..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D1464]/20 focus:border-[#1D1464]"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none"
        >
          <option value="ALL">După departament</option>
          <option value="Informatică">Informatică</option>
          <option value="Ingineria materialelor">Ingineria materialelor</option>
          <option value="Chimie aplicată">Chimie aplicată</option>
          <option value="Inginerie mecanică">Inginerie mecanică</option>
          <option value="Inginerie electrică">Inginerie electrică</option>
        </select>

        <select
          value={equipmentType}
          onChange={(e) => setEquipmentType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none"
        >
          <option value="ALL">După tip echipament</option>
          <option value="Server / HPC">Server / HPC</option>
          <option value="Microscopie">Microscopie</option>
          <option value="Spectroscopie">Spectroscopie</option>
          <option value="Stație de lucru">Stație de lucru</option>
          <option value="Prototipare">Prototipare</option>
          <option value="Măsurare">Măsurare</option>
        </select>

        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <span className="text-sm text-slate-700 font-medium mr-2">Dată</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm text-slate-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-3">
        {department === 'ALL' ? 'Toate departamentele' : department} •{' '}
        {equipmentType === 'ALL' ? 'Toate tipurile de echipamente' : equipmentType} •{' '}
        {selectedDate || 'Orice dată'}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-slate-900">Echipamente disponibile</h2>
          <span className="text-xs font-medium text-slate-500">{resources.length} resurse</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Ordonează:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="font-semibold text-slate-800 bg-transparent focus:outline-none"
          >
            <option value="recommended">Recomandate</option>
            <option value="name">Alfabetic (A-Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-sm text-slate-500">Se încarcă resursele...</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="h-28 rounded-xl bg-slate-50 border border-slate-200/80 relative overflow-hidden mb-4">
                  <svg className="w-full h-full stroke-slate-200" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.6" />
                    <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.6" />
                  </svg>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">{item.department}</span>

                  {item.requiresApproval ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      <Clock className="w-3 h-3" /> Necesită aprobare
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" /> Disponibil
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                <p className="text-[11px] text-slate-400 mt-2">
                  {item.code} • {item.location}
                </p>
              </div>

              <Link
                to={`/resursa/${item.id}`}
                className="mt-4 inline-flex items-center justify-center gap-1.5 w-fit px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#1D1464] hover:bg-[#EEF0FF] transition"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Vezi detalii / Rezervă
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-rose-500 shrink-0" />
        <span>
          Resursele marcate <strong className="text-slate-700">„Necesită aprobare”</strong> sunt confirmate de administratorul laboratorului.
        </span>
      </div>
    </div>
  );
}