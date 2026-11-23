import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  Settings,
  Inbox,
  Layers,
  History,
  Database,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const studentLinks = [
    { to: '/', label: 'Acasă', icon: Home },
    { to: '/rezervarile-mele', label: 'Rezervările mele', icon: Calendar },
    { to: '/setari', label: 'Setări cont', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/cereri', label: 'Cereri în așteptare', icon: Inbox },
    { to: '/', label: 'Toate resursele', icon: Layers },
    { to: '/admin/resurse', label: 'Gestionare resurse', icon: Database },
    { to: '/admin/istoric', label: 'Istoric', icon: History },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col justify-between p-4 border-r transition-colors ${
        isAdmin
          ? 'bg-white border-slate-200 text-slate-700'
          : 'bg-[#1D1464] border-[#1D1464] text-white'
      }`}
    >
      <div>
        <div
          className={`px-3 py-2 text-[11px] font-semibold tracking-wider uppercase ${
            isAdmin ? 'text-slate-400' : 'text-indigo-300'
          }`}
        >
          {isAdmin ? 'ADMINISTRARE' : 'SPAȚIUL MEU'}
        </div>

        <nav className="mt-2 space-y-1.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => {
                if (isAdmin) {
                  return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#EEF0FF] text-[#1D1464] font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`;
                }
                return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-[#1D1464] font-semibold shadow-sm'
                    : 'text-indigo-100 hover:bg-white/10'
                }`;
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className={`rounded-2xl p-4 border ${
          isAdmin
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-[#F8F5FF] border-indigo-100 text-slate-800'
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2.5">
          <HelpCircle className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">Ai nevoie de ajutor?</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Consultă ghidul de utilizare a resurselor de cercetare.
        </p>
        <button
          onClick={() => alert('Ghidul PDF de utilizare a echipamentelor USV a fost deschis.')}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1D1464] hover:underline"
        >
          Deschide ghidul <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}