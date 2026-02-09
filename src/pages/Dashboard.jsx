import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Users, UserCheck, UserX } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, aktif: 0, nonaktif: 0 });

  useEffect(() => {
    const getStats = async () => {
      const { data } = await supabase.from("kpm").select("status_kpm");
      if (data) {
        setStats({
          total: data.length,
          aktif: data.filter(i => i.status_kpm === 'aktif').length,
          nonaktif: data.filter(i => i.status_kpm === 'tidak aktif').length
        });
      }
    };
    getStats();
  }, []);

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ringkasan Data</h1>
        <p className="text-gray-500 text-sm">Selamat datang di sistem manajemen KPM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total KPM" value={stats.total} icon={Users} color="bg-blue-500" />
        <Card title="KPM Aktif" value={stats.aktif} icon={UserCheck} color="bg-emerald-500" />
        <Card title="KPM Nonaktif" value={stats.nonaktif} icon={UserX} color="bg-rose-500" />
      </div>
    </div>
  );
}