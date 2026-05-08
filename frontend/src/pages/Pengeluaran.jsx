import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Pengeluaran() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    keterangan: "",
    jumlah: "",
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
  });

  const getData = async () => {
    const res = await api.get("/pengeluaran");
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/pengeluaran", form);
      toast.success("Berhasil tambah");

      setForm({
        keterangan: "",
        jumlah: "",
        bulan: form.bulan,
        tahun: form.tahun,
      });

      getData();
    } catch {
      toast.error("Gagal");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/pengeluaran/${id}`);
    toast.success("Dihapus");
    getData();
  };

  return (
    <Layout>
      <Card title="Tambah Pengeluaran">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input"
            placeholder="Keterangan"
            value={form.keterangan}
            onChange={(e) =>
              setForm({ ...form, keterangan: e.target.value })
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Jumlah"
            value={form.jumlah}
            onChange={(e) =>
              setForm({ ...form, jumlah: e.target.value })
            }
          />

          <button className="btn-primary">Simpan</button>
        </form>
      </Card>

      <div className="mt-6">
        <Card title="Data Pengeluaran">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Keterangan</th>
                <th className="p-2">Jumlah</th>
                <th className="p-2">Bulan</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-2">{d.keterangan}</td>
                  <td className="p-2">
                    Rp {Number(d.jumlah).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {d.bulan}/{d.tahun}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  );
}