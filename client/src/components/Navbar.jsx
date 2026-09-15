import { BriefcaseBusiness, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const dashboardPath = { user: '/user/dashboard', recruiter: '/recruiter/dashboard', admin: '/admin/dashboard' };

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand' : 'text-stone-600 hover:text-ink dark:text-stone-300 dark:hover:text-white transition-colors duration-300'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <nav className="mx-auto max-w-7xl px-4 py-3" aria-label="Main navigation">
        <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-ink dark:text-white">
          <BriefcaseBusiness className="h-6 w-6 text-brand" />
          HireBoard
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <NavLink to="/jobs" className={linkClass}>Find jobs</NavLink>
          {token && <NavLink to={dashboardPath[role]} className={linkClass}>Dashboard</NavLink>}
          <button
            onClick={toggleDark}
            title="Toggle dark mode"
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand/50 ${dark ? 'bg-stone-700' : 'bg-stone-200 border border-stone-300'}`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${dark ? 'translate-x-8' : 'translate-x-1'}`}
            >
              {dark ? <Moon className="h-3 w-3 text-stone-800" /> : <Sun className="h-3 w-3 text-stone-500" />}
            </span>
          </button>
          {token ? (
            <button className="btn-secondary px-2 sm:px-4" onClick={logout}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span></button>
          ) : (
            <Link className="btn-primary" to="/login">Login</Link>
          )}
        </div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="btn-secondary h-10 w-10 p-0 md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
        {menuOpen && (
          <div className="mt-3 grid gap-2 border-t border-stone-200 pt-3 dark:border-stone-800 md:hidden">
            <NavLink to="/jobs" onClick={() => setMenuOpen(false)} className={`${linkClass({ isActive: false })} rounded-md px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-900`}>Find jobs</NavLink>
            {token && <NavLink to={dashboardPath[role]} onClick={() => setMenuOpen(false)} className={`${linkClass({ isActive: false })} rounded-md px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-900`}>Dashboard</NavLink>}
            <div className="flex items-center gap-2 px-1 pt-1">
              <button onClick={toggleDark} className="btn-secondary flex-1">{dark ? 'Light mode' : 'Dark mode'}</button>
              {token ? <button className="btn-primary flex-1" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button> : <Link className="btn-primary flex-1" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
