import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Rumah() {
  const [rumah, setRumah] = useState([]);
  const [penghuni, setPenghuni] = useState([]);
  const [selectedPenghuni, setSelectedPenghuni] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedRumah, setSelectedRumah] = useState(null);

  const [form, setForm] = useState({
    nama_rumah: "",
    alamat: "",
  });

  // 🔷 LOAD DATA
  const getData = async () => {
    try {
      const [r, p] = await Promise.all([
        api.get("/rumah"),
        api.get("/penghuni"),
      ]);

      setRumah(r.data);
      setPenghuni(p.data);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 🔷 INPUT
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔷 RESET FORM
  const resetForm = () => {
    setForm({ nama_rumah: "", alamat: "" });
    setEditId(null);
  };

  // 🔷 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/rumah/${editId}`, form);
      } else {
        await api.post("/rumah", form);
      }

      resetForm();
      getData();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Gagal menyimpan data");
    }
  };

  // 🔷 EDIT
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      nama_rumah: item.nama_rumah,
      alamat: item.alamat,
    });
  };

  // 🔷 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus rumah?")) return;

    try {
      await api.delete(`/rumah/${id}`);
      getData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔷 ASSIGN
  const handleAssign = async (id) => {
    if (!selectedPenghuni[id]) {
      toast.error("Pilih penghuni dulu");
      return;
    }

    try {
      await api.post(`/rumah/${id}/assign`, {
        penghuni_id: selectedPenghuni[id],
      });

      getData();
    } catch (err) {
      console.error("Assign error:", err.response?.data || err.message);
      toast.error("Gagal assign");
    }
  };

  // 🔷 HISTORY
const openHistory = async (rumah) => {
  try {
    const res = await api.get(`/rumah/${rumah.id}`);

    setSelectedRumah(rumah);
    setHistory(res.data.penghuni || []);
    setShowHistory(true);
  } catch (err) {
    console.error("History error:", err);
    toast.error("Gagal load history");
  }
};

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Data Rumah</h1>

      {/* 🔷 FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 mb-6 rounded shadow space-y-3"
      >
        <input
          name="nama_rumah"
          value={form.nama_rumah}
          onChange={handleChange}
          placeholder="Nama Rumah"
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat"
          className="w-full p-2 border rounded"
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Simpan"}
        </button>
      </form>

      {/* 🔷 TABLE */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Nama</th>
            <th className="p-3">Alamat</th>
            <th className="p-3">Status</th>
            <th className="p-3">Penghuni Aktif</th>
            <th className="p-3">Assign</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {rumah.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.nama_rumah}</td>
              <td className="p-3">{item.alamat}</td>

              <td className="p-3">
                {item.status === "dihuni" ? "Dihuni" : "Kosong"}
              </td>

              {/* 🔥 PENGHUNI AKTIF */}
              <td className="p-3">
                {item.penghuni_aktif?.penghuni?.nama_lengkap || "-"}
              </td>

              {/* 🔷 ASSIGN */}
              <td className="p-3">
                <select
                  value={selectedPenghuni[item.id] || ""}
                  onChange={(e) =>
                    setSelectedPenghuni((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  className="border p-1 rounded"
                >
                  <option value="">Pilih</option>
                  {penghuni.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_lengkap}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssign(item.id)}
                  className="bg-green-600 text-white px-2 py-1 ml-2 rounded"
                >
                  Assign
                </button>
              </td>

              {/* 🔷 AKSI */}
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>

                <button
                    onClick={() => openHistory(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                    History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔷 MODAL HISTORY */}
        {selectedRumah && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[700px] rounded-lg shadow-lg p-6">

            <h2 className="text-lg font-bold mb-4">
                History Penghuni - {selectedRumah.nama_rumah}
            </h2>

            <table className="w-full text-sm">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 text-left">Nama</th>
                    <th className="p-2 text-left">Masuk</th>
                    <th className="p-2 text-left">Keluar</th>
                    <th className="p-2 text-left">Status</th>
                </tr>
                </thead>

                <tbody>
                {history.length > 0 ? (
                    history.map((h) => (
                    <tr key={h.id} className="border-t">
                        <td className="p-2">{h.nama_lengkap}</td>

                        <td className="p-2">
                        {h.pivot?.tanggal_masuk || "-"}
                        </td>

                        <td className="p-2">
                        {h.pivot?.tanggal_keluar || "-"}
                        </td>

                        <td className="p-2">
                        <span
                            className={`px-2 py-1 text-xs rounded ${
                            h.pivot?.is_active
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {h.pivot?.is_active ? "Aktif" : "Tidak"}
                        </span>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-400">
                        Belum ada history
                    </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="mt-4 text-right">
                <button
                onClick={() => setSelectedRumah(null)}
                className="btn-secondary"
                >
                Tutup
                </button>
            </div>

            </div>
        </div>
        )}
    </Layout>
  );
}