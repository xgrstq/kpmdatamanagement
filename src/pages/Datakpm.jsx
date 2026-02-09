import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Edit3, Trash2, Filter, Plus, Eye } from "lucide-react";

export default function DataKpm() {
  const [kpmList, setKpmList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    nik: "",
    kk: "",
    nama: "",
    status: "",
  });

  const [editData, setEditData] = useState(null);
  const [addData, setAddData] = useState(null);

  // DETAIL MODAL
  const [detailKpm, setDetailKpm] = useState(null);
  const [anggotaList, setAnggotaList] = useState([]);
  const [anggotaForm, setAnggotaForm] = useState({
    nik: "",
    nama: "",
    status_keluarga: "",
    pekerjaan: "",
  });

  // EDIT ANGGOTA
  const [editAnggota, setEditAnggota] = useState(null);

  const fetchKpm = async () => {
    setLoading(true);

    try {
      let query = supabase.from("kpm").select("*");

      if (filters.kk) query = query.ilike("no_kk", `%${filters.kk}%`);
      if (filters.nama)
        query = query.ilike("nama_kepala_keluarga", `%${filters.nama}%`);
      if (filters.status) query = query.eq("status_kpm", filters.status);

      if (filters.nik) {
        const { data: anggota, error: anggotaError } = await supabase
          .from("anggota_kpm")
          .select("kpm_id")
          .ilike("nik", `%${filters.nik}%`);

        if (anggotaError) throw anggotaError;

        const ids = anggota?.map((a) => a.kpm_id) || [];

        query =
          ids.length > 0
            ? query.in("id", ids)
            : query.eq("id", "00000000-0000-0000-0000-000000000000");
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      setKpmList(data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpm();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Data ini akan dihapus permanen. Lanjutkan?")) return;

    const { error } = await supabase.from("kpm").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchKpm();
  };

  const handleEditSave = async () => {
    const { error } = await supabase
      .from("kpm")
      .update({
        no_kk: editData.no_kk,
        nama_kepala_keluarga: editData.nama_kepala_keluarga,
        desa: editData.desa,
        kecamatan: editData.kecamatan,
        status_kpm: editData.status_kpm,
      })
      .eq("id", editData.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditData(null);
    fetchKpm();
  };

  const handleAddSave = async () => {
    const { error } = await supabase.from("kpm").insert([
      {
        no_kk: addData.no_kk,
        nama_kepala_keluarga: addData.nama_kepala_keluarga,
        desa: addData.desa,
        kecamatan: addData.kecamatan,
        status_kpm: addData.status_kpm,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setAddData(null);
    fetchKpm();
  };

  // ANGGOTA KELUARGA
  const fetchAnggota = async (kpm_id) => {
    const { data, error } = await supabase
      .from("anggota_kpm")
      .select("*")
      .eq("kpm_id", kpm_id)
      .order("created_at", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setAnggotaList(data || []);
  };

  const openDetail = async (item) => {
    setDetailKpm(item);
    setEditAnggota(null);

    setAnggotaForm({
      nik: "",
      nama: "",
      status_keluarga: "",
      pekerjaan: "",
    });

    await fetchAnggota(item.id);
  };

  const handleAddAnggota = async () => {
    if (!detailKpm) return;

    if (!anggotaForm.nik || !anggotaForm.nama || !anggotaForm.status_keluarga) {
      alert("NIK, Nama, dan Status Keluarga wajib diisi!");
      return;
    }

    const { error } = await supabase.from("anggota_kpm").insert([
      {
        kpm_id: detailKpm.id,
        nik: anggotaForm.nik,
        nama: anggotaForm.nama,
        status_keluarga: anggotaForm.status_keluarga,
        pekerjaan: anggotaForm.pekerjaan,
        hubungan: anggotaForm.status_keluarga,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setAnggotaForm({
      nik: "",
      nama: "",
      status_keluarga: "",
      pekerjaan: "",
    });

    fetchAnggota(detailKpm.id);
  };

  const handleUpdateAnggota = async () => {
    if (!detailKpm || !editAnggota) return;

    if (!anggotaForm.nik || !anggotaForm.nama || !anggotaForm.status_keluarga) {
      alert("NIK, Nama, dan Status Keluarga wajib diisi!");
      return;
    }

    const { error } = await supabase
      .from("anggota_kpm")
      .update({
        nik: anggotaForm.nik,
        nama: anggotaForm.nama,
        status_keluarga: anggotaForm.status_keluarga,
        pekerjaan: anggotaForm.pekerjaan,
        hubungan: anggotaForm.status_keluarga,
      })
      .eq("id", editAnggota.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditAnggota(null);

    setAnggotaForm({
      nik: "",
      nama: "",
      status_keluarga: "",
      pekerjaan: "",
    });

    fetchAnggota(detailKpm.id);
  };

  const handleDeleteAnggota = async (id) => {
    if (!detailKpm) return;

    if (!confirm("Hapus anggota ini?")) return;

    const { error } = await supabase.from("anggota_kpm").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAnggota(detailKpm.id);
  };

  const cancelEditAnggota = () => {
    setEditAnggota(null);
    setAnggotaForm({
      nik: "",
      nama: "",
      status_keluarga: "",
      pekerjaan: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Data KPM
        </h1>

        <button
          onClick={() =>
            setAddData({
              no_kk: "",
              nama_kepala_keluarga: "",
              desa: "",
              kecamatan: "",
              status_kpm: "aktif",
            })
          }
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
        >
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="NIK Anggota"
            onChange={(e) => setFilters({ ...filters, nik: e.target.value })}
          />

          <input
            className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="No KK"
            onChange={(e) => setFilters({ ...filters, kk: e.target.value })}
          />

          <input
            className="border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Nama Kepala"
            onChange={(e) => setFilters({ ...filters, nama: e.target.value })}
          />

          <select
            className="border-gray-200 border p-2.5 rounded-lg outline-none"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak aktif">Tidak Aktif</option>
          </select>

          <button
            onClick={fetchKpm}
            className="bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 flex items-center justify-center gap-2"
          >
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
              <th className="p-4 font-semibold text-gray-600">
                Nama Kepala Keluarga
              </th>
              <th className="p-4 font-semibold text-gray-600">Wilayah</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Status
              </th>
              <th className="p-4 font-semibold text-gray-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : kpmList.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Data kosong.
                </td>
              </tr>
            ) : (
              kpmList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono text-sm">{item.no_kk}</td>
                  <td className="p-4 font-medium">
                    {item.nama_kepala_keluarga}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {item.desa}, {item.kecamatan}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        item.status_kpm === "aktif"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status_kpm}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openDetail(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => setEditData(item)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ADD */}
      {addData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Tambah Data KPM
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="No KK"
                value={addData.no_kk}
                onChange={(e) =>
                  setAddData({ ...addData, no_kk: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nama Kepala Keluarga"
                value={addData.nama_kepala_keluarga}
                onChange={(e) =>
                  setAddData({
                    ...addData,
                    nama_kepala_keluarga: e.target.value,
                  })
                }
              />

              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Desa"
                value={addData.desa}
                onChange={(e) =>
                  setAddData({ ...addData, desa: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Kecamatan"
                value={addData.kecamatan}
                onChange={(e) =>
                  setAddData({ ...addData, kecamatan: e.target.value })
                }
              />

              <select
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={addData.status_kpm}
                onChange={(e) =>
                  setAddData({ ...addData, status_kpm: e.target.value })
                }
              >
                <option value="aktif">Aktif</option>
                <option value="tidak aktif">Tidak Aktif</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddData(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                Batal
              </button>

              <button
                onClick={handleAddSave}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Edit Data KPM</h2>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="No KK"
                value={editData.no_kk}
                onChange={(e) =>
                  setEditData({ ...editData, no_kk: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nama Kepala Keluarga"
                value={editData.nama_kepala_keluarga}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    nama_kepala_keluarga: e.target.value,
                  })
                }
              />

              <input
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Desa"
                value={editData.desa || ""}
                onChange={(e) =>
                  setEditData({ ...editData, desa: e.target.value })
                }
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

      {/* MODAL DETAIL */}
      {detailKpm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl p-6 space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Detail KPM & Anggota Keluarga
              </h2>

              <button
                onClick={() => {
                  setDetailKpm(null);
                  setEditAnggota(null);
                  setAnggotaForm({
                    nik: "",
                    nama: "",
                    status_keluarga: "",
                    pekerjaan: "",
                  });
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                Tutup
              </button>
            </div>

            {/* Info KK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl">
              <p>
                <b>No KK:</b> {detailKpm.no_kk}
              </p>
              <p>
                <b>Kepala Keluarga:</b> {detailKpm.nama_kepala_keluarga}
              </p>
              <p>
                <b>Desa:</b> {detailKpm.desa}
              </p>
              <p>
                <b>Kecamatan:</b> {detailKpm.kecamatan}
              </p>
              <p>
                <b>Status:</b> {detailKpm.status_kpm}
              </p>
            </div>

            {/* Form Tambah / Edit Anggota */}
            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800">
                {editAnggota ? "Edit Anggota Keluarga" : "Tambah Anggota Keluarga"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  className="border-gray-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="NIK"
                  value={anggotaForm.nik}
                  onChange={(e) =>
                    setAnggotaForm({ ...anggotaForm, nik: e.target.value })
                  }
                />

                <input
                  className="border-gray-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nama"
                  value={anggotaForm.nama}
                  onChange={(e) =>
                    setAnggotaForm({ ...anggotaForm, nama: e.target.value })
                  }
                />

                <input
                  className="border-gray-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Status (anak/istri/ayah)"
                  value={anggotaForm.status_keluarga}
                  onChange={(e) =>
                    setAnggotaForm({
                      ...anggotaForm,
                      status_keluarga: e.target.value,
                    })
                  }
                />

                <input
                  className="border-gray-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Pekerjaan"
                  value={anggotaForm.pekerjaan}
                  onChange={(e) =>
                    setAnggotaForm({
                      ...anggotaForm,
                      pekerjaan: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editAnggota ? handleUpdateAnggota : handleAddAnggota}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-xl font-semibold transition"
                >
                  {editAnggota ? "Update Anggota" : "Simpan Anggota"}
                </button>

                {editAnggota && (
                  <button
                    onClick={cancelEditAnggota}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl font-semibold transition"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </div>

            {/* Table Anggota */}
            <div className="border border-gray-100 rounded-xl overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">NIK</th>
                    <th className="p-4 font-semibold text-gray-600">Nama</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">
                      Pekerjaan
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {anggotaList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        Belum ada anggota keluarga.
                      </td>
                    </tr>
                  ) : (
                    anggotaList.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono text-sm">{a.nik}</td>
                        <td className="p-4 font-medium">{a.nama}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {a.status_keluarga}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {a.pekerjaan}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditAnggota(a);
                                setAnggotaForm({
                                  nik: a.nik,
                                  nama: a.nama,
                                  status_keluarga: a.status_keluarga || "",
                                  pekerjaan: a.pekerjaan || "",
                                });
                              }}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                            >
                              <Edit3 size={18} />
                            </button>

                            <button
                              onClick={() => handleDeleteAnggota(a.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-gray-400 text-center pt-2">
              by ngodinginaja
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
