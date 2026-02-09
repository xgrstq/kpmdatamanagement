import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react";

export default function Sidebar({ closeMenu }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    if (closeMenu) closeMenu();
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
      isActive
        ? "bg-emerald-700 text-white"
        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
    }`;

  return (
    <div className="w-64 h-full bg-white border-r border-gray-100 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-800">KPM <span className="text-emerald-600">Data</span></h1>
      </div>

    <p className="px-2 mb-4 text-gray-500 text-sm font-semibold tracking-wide">
       kpmdatamanagement
      </p>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/" className={menuClass} onClick={closeMenu}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/kpm" className={menuClass} onClick={closeMenu}>
          <Users size={20} /> Data KPM
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}