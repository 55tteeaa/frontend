import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, ChevronLeft, ChevronRight, Info, MapPin, X } from 'lucide-react';
import { apiFetch } from '../api/client';

const WEEK_DAYS = [
  { label: 'Luni', dayNum: '26', date: '2026-10-26' },
  { label: 'Marți', dayNum: '27', date: '2026-10-27' },
  { label: 'Miercuri', dayNum: '28', date: '2026-10-28' },
  { label: 'Joi', dayNum: '29', date: '2026-10-29' },
  { label: 'Vineri', dayNum: '30', date: '2026-10-30' },
  { label: 'Sâmbătă', dayNum: '31', date: '2026-10-31' },
  { label: 'Duminică', dayNum: '1', date: '2026-11-01' },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

export default function ResourceBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({ date: '2026-10-28', hour: 10 });
  const [purpose, setPurpose] = useState(
    'Antrenarea unui model de învățare automată pentru proiectul de disertație.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    const [resData, slotsData] = await Promise.all([
      apiFetch(`/resources/${id}`),
      apiFetch(`/bookings/resource/${id}?startDate=2026-10-26&endDate=2026-11-01`),
    ]);
    setResource(resData);
    setOccupiedSlots(slotsData);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const isOccupied = (date, hour) => {
    return occupiedSlots.some(
      (b) => b.date === date && hour >= b.startHour && hour < b.endHour
    );
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const created = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          resourceId: id,
          date: selectedSlot.date,
          startHour: selectedSlot.hour,
          endHour: selectedSlot.hour + 1,
          purpose,
        }),
      });
      await loadData();
      setSelectedSlot(null);
      setFeedback(
        created.status === 'PENDING'
          ? 'Cererea a fost trimisă spre aprobarea administratorului.'
          : 'Rezervarea a fost confirmată cu succes!'
      );
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!resource) return <div className="text-sm text-slate-500">Se încarcă detaliile resursei...</div>;

  const formatRoDate = (dateStr) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    return `${parseInt(d, 10)} ${m === '11' ? 'noiembrie' : 'octombrie'} 2026`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xs font-bold tracking-wider text-[#3729A6] uppercase">
        RESURSE / {resource.name.toUpperCase()}
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">
        Planifică timpul pentru cercetare.
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Verifică disponibilitatea echipamentului și confirmă intervalul potrivit proiectului tău.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {resource.department}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                <Check className="w-3 h-3" /> Disponibil
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-2">{resource.name}</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{resource.description}</p>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {resource.location} • {resource.code}
              </span>
            </div>

            <hr className="my-5 border-slate-100" />

            <h3 className="text-xs font-bold text-slate-900">Reguli de utilizare</h3>
            <ul className="mt-3 space-y-2">
              {resource.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <Check className="w-3.5 h-3.5 text-[#3729A6] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedSlot && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Calendar className="w-4 h-4 text-[#1D1464]" />
                  <span>Confirmă rezervarea</span>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Confirmă rezervarea pentru data{' '}
                <strong className="text-slate-900">{formatRoDate(selectedSlot.date)}</strong>, ora{' '}
                <strong className="text-slate-900">
                  {String(selectedSlot.hour).padStart(2, '0')}:00–
                  {String(selectedSlot.hour + 1).padStart(2, '0')}:00
                </strong>
                .
              </p>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Scopul cercetării
                </label>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1D1464]/20 focus:border-[#1D1464]"
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#1D1464] hover:bg-[#2A1E85] text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {submitting ? 'Se salvează...' : 'Confirmă'}
                </button>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Anulează
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <span>{feedback}</span>
              <button
                onClick={() => navigate('/rezervarile-mele')}
                className="font-bold underline ml-2"
              >
                Vezi rezervări
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                26 octombrie – 1 noiembrie 2026
              </h2>
              <p className="text-xs text-slate-400">
                Program de rezervare • ora locală a României
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" />
              <span>Liber</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span>Ocupat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#1D1464] inline-block" />
              <span>Selectat</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-8 gap-2 mb-3 text-center">
                <div />
                {WEEK_DAYS.map((day) => {
                  const isActiveDay = selectedSlot?.date === day.date;
                  return (
                    <div key={day.date} className="flex flex-col items-center">
                      <span className="text-[11px] text-slate-400">{day.label}</span>
                      <span
                        className={`mt-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActiveDay
                            ? 'bg-[#EEF0FF] text-[#1D1464]'
                            : 'text-slate-700'
                        }`}
                      >
                        {day.dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                {HOURS.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-2 items-center">
                    <div className="text-[11px] text-slate-400 text-right pr-2">
                      {hour}:00
                    </div>

                    {WEEK_DAYS.map((day) => {
                      const isWeekend = day.label === 'Sâmbătă' || day.label === 'Duminică';
                      const occupied = isOccupied(day.date, hour);
                      const selected =
                        selectedSlot?.date === day.date && selectedSlot?.hour === hour;

                      if (isWeekend) {
                        return (
                          <div
                            key={day.date}
                            className="h-9 rounded-lg bg-slate-100 border border-slate-200/50"
                          />
                        );
                      }

                      if (occupied) {
                        return (
                          <div
                            key={day.date}
                            className="h-9 rounded-lg bg-slate-200/80 text-slate-500 text-[10px] font-medium flex items-center justify-center select-none"
                          >
                            Ocupat
                          </div>
                        );
                      }

                      if (selected) {
                        return (
                          <button
                            key={day.date}
                            onClick={() => setSelectedSlot(null)}
                            className="h-9 rounded-lg bg-[#1D1464] text-white text-[10px] font-semibold flex flex-col items-center justify-center leading-tight shadow-sm"
                          >
                            <span>
                              {String(hour).padStart(2, '0')}:00–{String(hour + 1).padStart(2, '0')}:00
                            </span>
                            <span className="text-[9px] text-indigo-200">Selectat</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={day.date}
                          onClick={() => setSelectedSlot({ date: day.date, hour })}
                          className="h-9 rounded-lg bg-white border border-slate-200 hover:border-[#1D1464] hover:bg-[#EEF0FF]/40 transition"
                          title={`Rezervă ${day.label}, ${hour}:00`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>Intervalele albe sunt libere. Rezervările se fac în sesiuni de minimum o oră.</span>
          </div>
        </div>
      </div>
    </div>
  );
}