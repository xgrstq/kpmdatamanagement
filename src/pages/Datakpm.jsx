import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Search, Edit3, Trash2, Filter, Plus } from "lucide-react";

export default function DataKpm() {
  const [kpmList, setKpmList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ nik: "", kk: "", nama: "", status: "" });
  const [editData, setEditData] = useState(null);

  const fetchKpm = async () => {
    setLoading(true);
    try {
      let query = supabase.from("kpm").select("*");
      if (filters.kk) query = query.ilike("no_kk", `%${filters.kk}%`);
      if (filters.nama) query = query.ilike("nama_kepala_keluarga", `%${filters.nama}%`);
      if (filters.status) query = query.eq("status_kpm", filters.status);

      if (filters.nik) {
        const { data: anggota } = await supabase.from("anggota_kpm").select("kpm_id").ilike("nik", `%${filters.nik}%`);
        const ids = anggota?.map((a) => a.kpm_id) || [];
        query = ids.length > 0 ? query.in("id", ids) : query.eq("id", 0); 
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setKpmList(data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKpm(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Data ini akan dihapus permanen. Lanjutkan?")) return;
    const { error } = await supabase.from("kpm").delete().eq("id", id);
    if (!error) fetchKpm();
  };

  const handleEditSave = async () => {
    const { error } = await supabase.from("kpm").update({
      no_kk: editData.no_kk,
      nama_kepala_keluarga: editData.nama_kepala_keluarga,
      desa: editData.desa,
      kecamatan: editData.kecamatan,
      status_kpm: editData.status_kpm,
    }).eq("id", editData.id);

    if (!error) {
      setEditData(null);
      fetchKpm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data KPM</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition">
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="NIK Anggota" onChange={e => setFilters({...filters, nik: e.target.value})} />
          <input className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="No KK" onChange={e => setFilters({...filters, kk: e.target.value})} />
          <input className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nama Kepala" onChange={e => setFilters({...filters, nama: e.target.value})} />
          <select className="border-gray-200 border p-2.5 rounded-lg outline-none" onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak aktif">Tidak Aktif</option>
          </select>
          <button onClick={fetchKpm} className="bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 flex items-center justify-center gap-2">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">No KK</th>
              <th className="p-4 font-semibold text-gray-600">Nama Kepala Keluarga</th>
              <th className="p-4 font-semibold text-gray-600">Wilayah</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
            ) : kpmList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-sm">{item.no_kk}</td>
                <td className="p-4 font-medium">{item.nama_kepala_keluarga}</td>
                <td className="p-4 text-sm text-gray-500">{item.desa}, {item.kecamatan}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    item.status_kpm === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.status_kpm}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditData(item)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4">
      
      <h2 className="text-xl font-bold text-gray-800">
        Edit Data KPM
      </h2>

      <div className="space-y-3">
        <input
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="No KK"
          value={editData.no_kk}
          onChange={(e) => setEditData({ ...editData, no_kk: e.target.value })}
        />

        <input
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Nama Kepala Keluarga"
          value={editData.nama_kepala_keluarga}
          onChange={(e) =>
            setEditData({ ...editData, nama_kepala_keluarga: e.target.value })
          }
        />

        <input
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Desa"
          value={editData.desa || ""}
          onChange={(e) => setEditData({ ...editData, desa: e.target.value })}
        />

        <input
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Kecamatan"
          value={editData.kecamatan || ""}
          onChange={(e) =>
            setEditData({ ...editData, kecamatan: e.target.value })
          }
        />

        <select
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          value={editData.status_kpm}
          onChange={(e) =>
            setEditData({ ...editData, status_kpm: e.target.value })
          }
        >
          <option value="aktif">Aktif</option>
          <option value="tidak aktif">Tidak Aktif</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => setEditData(null)}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          Batal
        </button>

        <button
          onClick={handleEditSave}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}