import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="animate-slide-in">
            <Sidebar closeMenu={() => setOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setOpen(true)} />
        
        <main className="p-4 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="px-8 py-4 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
          &copy; 2026 KPM Management • Built by <span className="font-semibold text-emerald-600">ngodinginaja</span>
        </footer>
      </div>
    </div>
  );
}