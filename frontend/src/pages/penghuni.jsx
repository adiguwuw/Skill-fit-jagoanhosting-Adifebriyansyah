import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";

export default function Penghuni() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nama_lengkap: "",
    status_penghuni: "kontrak",
    no_telepon: "",
    is_menikah: false,
    foto_ktp: null,
  });

  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  // 🔷 LOAD DATA
  const getPenghuni = async () => {
    const res = await api.get("/penghuni");
    setData(res.data);
  };

  useEffect(() => {
    getPenghuni();
  }, []);

  // 🔷 HANDLE FILE
  const handleFile = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      foto_ktp: file,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔷 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nama_lengkap", form.nama_lengkap);
      formData.append("status_penghuni", form.status_penghuni);
      formData.append("no_telepon", form.no_telepon);
      formData.append("is_menikah", form.is_menikah ? 1 : 0);

      if (form.foto_ktp) {
        formData.append("foto_ktp", form.foto_ktp);
      }

      // 🔥 TANPA HEADER MANUAL
      if (editId) {
        formData.append("_method", "PUT");

        await api.post(`/penghuni/${editId}`, formData);
        toast.success("Berhasil update");
      } else {
        await api.post("/penghuni", formData);
        toast.success("Berhasil tambah");
      }

      // reset
      setForm({
        nama_lengkap: "",
        status_penghuni: "kontrak",
        no_telepon: "",
        is_menikah: false,
        foto_ktp: null,
      });

      setPreview(null);
      setEditId(null);

      getPenghuni();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Gagal upload");
    }
  };

  // 🔷 EDIT
  const handleEdit = (item) => {
    setForm({
      nama_lengkap: item.nama_lengkap,
      status_penghuni: item.status_penghuni,
      no_telepon: item.no_telepon,
      is_menikah: item.is_menikah,
      foto_ktp: null,
    });

    setPreview(
      item.foto_ktp
        ? `http://127.0.0.1:8000/storage/${item.foto_ktp}`
        : null
    );

    setEditId(item.id);
  };

  // 🔷 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus?")) return;

    await api.delete(`/penghuni/${id}`);
    getPenghuni();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Data Penghuni</h1>

      {/* FORM */}
      <Card title="Tambah Penghuni">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Nama Lengkap"
            className="input"
            value={form.nama_lengkap}
            onChange={(e) =>
              setForm({ ...form, nama_lengkap: e.target.value })
            }
          />

          <select
            className="input"
            value={form.status_penghuni}
            onChange={(e) =>
              setForm({ ...form, status_penghuni: e.target.value })
            }
          >
            <option value="kontrak">Kontrak</option>
            <option value="tetap">Tetap</option>
          </select>

          <input
            placeholder="Nomor Telepon"
            className="input"
            value={form.no_telepon}
            onChange={(e) =>
              setForm({ ...form, no_telepon: e.target.value })
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_menikah}
              onChange={(e) =>
                setForm({ ...form, is_menikah: e.target.checked })
              }
            />
            Sudah Menikah
          </label>

          {/* FILE */}
          <input type="file" onChange={handleFile} />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              className="w-32 h-32 object-cover rounded border"
            />
          )}

          <button className="btn-primary">
            {editId ? "Update" : "Simpan"}
          </button>
        </form>
      </Card>

      {/* TABLE */}
      <div className="mt-6">
        <Card title="Data Penghuni">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">KTP</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">No HP</th>
                <th className="p-3 text-left">Menikah</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.nama_lengkap}</td>

                  <td className="p-3">
                    {item.foto_ktp && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${item.foto_ktp}`}
                        className="w-16 h-16 object-cover rounded"
                        onClick={() => setZoomImage(`http://127.0.0.1:8000/storage/${item.foto_ktp}`)}
                      />
                    )}
                  </td>

                  <td className="p-3">{item.status_penghuni}</td>
                  <td className="p-3">{item.no_telepon}</td>
                  <td className="p-3">
                    {item.is_menikah ? "Ya" : "Tidak"}
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {zoomImage && (
            <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setZoomImage(null)}
            >
                <div
                className="relative max-w-3xl w-full p-4"
                onClick={(e) => e.stopPropagation()}
                >
                {/* CLOSE BUTTON */}
                <button
                    className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black"
                    onClick={() => setZoomImage(null)}
                >
                    ✕
                </button>

                {/* IMAGE */}
                <img
                    src={zoomImage}
                    className="w-full max-h-[80vh] object-contain rounded shadow-lg"
                />
                </div>
            </div>
            )}
        </Card>
      </div>
    </Layout>
  );
}