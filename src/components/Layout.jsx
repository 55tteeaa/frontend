import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, BookOpen, Palette } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, theme, onThemeChange }) {
  const { user, availableUsers, loginAs } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitchUser = async (targetUser) => {
    await loginAs(targetUser.email);
    setMenuOpen(false);
    navigate(targetUser.role === 'ADMIN' ? '/admin/cereri' : '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1D1464] text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 leading-tight">Campus Cercetare</div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              UNIVERSITATEA ȘTEFAN CEL MARE
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4 relative">
          <label className="flex items-center gap-2 text-slate-500">
            <Palette className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Temă</span>
            <select
              aria-label="Alege tema"
              value={theme}
              onChange={(event) => onThemeChange(event.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1D1464]/20"
            >
              <option value="light">Luminoasă</option>
              <option value="dark">Întunecată</option>
              <option value="pink">Foarte roz</option>
              <option value="neon">Neon noir</option>
            </select>
          </label>

          {user?.role === 'ADMIN' && (
            <span className="px-3 py-1 rounded-lg bg-[#EEF0FF] text-[#1D1464] text-xs font-semibold">
              Administrare
            </span>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 text-right hover:bg-slate-50 px-2.5 py-1.5 rounded-xl transition"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-500">
                {user?.role === 'ADMIN' ? 'Administrator resurse' : `Student • ${user?.department}`}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-[#1D1464] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-14 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase">
                Schimbă rolul (Demo Echipă)
              </div>
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex flex-col ${
                    user?.id === u.id ? 'bg-[#EEF0FF]/60 font-semibold text-[#1D1464]' : 'text-slate-700'
                  }`}
                >
                  <span>{u.name}</span>
                  <span className="text-xs text-slate-500">
                    {u.role === 'ADMIN' ? 'Administrator resurse' : `Student • ${u.department}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}