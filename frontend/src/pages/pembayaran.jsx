import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Pembayaran() {
  const [data, setData] = useState([]);
  const [penghuni, setPenghuni] = useState([]);
  const [rumah, setRumah] = useState([]);

  const [form, setForm] = useState({
    penghuni_id: "",
    rumah_id: "",
    jenis_iuran: "kebersihan",
    jumlah: "",
    bulan: "",
    tahun: new Date().getFullYear(),
    status: "lunas",
  });

  // 🔥 LIST BULAN
  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  // 🔷 LOAD DATA
  const load = async () => {
    try {
      const [res, p, r] = await Promise.all([
        api.get("/pembayaran"),
        api.get("/penghuni"),
        api.get("/rumah"),
      ]);

      setData(res.data);
      setPenghuni(p.data);
      setRumah(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔷 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/pembayaran", form);

      toast.success("Berhasil tambah pembayaran");

      setForm({
        penghuni_id: "",
        rumah_id: "",
        jenis_iuran: "kebersihan",
        jumlah: "",
        bulan: "",
        tahun: new Date().getFullYear(),
        status: "lunas",
      });

      load();
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Gagal menambah pembayaran");
    }
  };

  // 🔷 TOGGLE STATUS
  const toggleStatus = async (item) => {
    try {
      await api.put(`/pembayaran/${item.id}`, {
        status: item.status === "lunas" ? "belum" : "lunas",
      });

      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      {/* 🔷 FORM */}
      <Card title="Tambah Pembayaran">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <Select
            label="Penghuni"
            value={form.penghuni_id}
            onChange={(e) =>
              setForm({ ...form, penghuni_id: e.target.value })
            }
          >
            <option value="">Pilih Penghuni</option>
            {penghuni.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_lengkap}
              </option>
            ))}
          </Select>

          <Select
            label="Rumah"
            value={form.rumah_id}
            onChange={(e) =>
              setForm({ ...form, rumah_id: e.target.value })
            }
          >
            <option value="">Pilih Rumah</option>
            {rumah.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama_rumah}
              </option>
            ))}
          </Select>

          <Select
            label="Jenis Iuran"
            value={form.jenis_iuran}
            onChange={(e) =>
              setForm({ ...form, jenis_iuran: e.target.value })
            }
          >
            <option value="kebersihan">Kebersihan</option>
            <option value="satpam">Satpam</option>
          </Select>

          <Input
            label="Jumlah"
            value={form.jumlah}
            onChange={(e) =>
              setForm({ ...form, jumlah: e.target.value })
            }
          />

          {/* 🔥 BULAN */}
          <Select
            label="Bulan"
            value={form.bulan}
            onChange={(e) =>
              setForm({ ...form, bulan: e.target.value })
            }
          >
            <option value="">Pilih Bulan</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="lunas">Lunas</option>
            <option value="belum">Belum</option>
          </Select>

          <div className="col-span-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Card>

      {/* 🔷 TABLE */}
        <div className="mt-6">
        <Card title="Data Pembayaran">
            <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
                {/* HEADER */}
                <thead className="bg-blue-50 text-blue-700">
                <tr>
                    <th className="px-4 py-3 text-left w-[25%]">Nama</th>
                    <th className="px-4 py-3 text-center w-[15%]">Jenis</th>
                    <th className="px-4 py-3 text-right w-[20%]">Jumlah</th>
                    <th className="px-4 py-3 text-center w-[20%]">Bulan</th>
                    <th className="px-4 py-3 text-center w-[20%]">Status</th>
                </tr>
                </thead>

                {/* BODY */}
                <tbody className="bg-white">
                {data.map((d) => (
                    <tr
                    key={d.id}
                    className="border-t hover:bg-gray-50 transition"
                    >
                    {/* NAMA */}
                    <td className="px-4 py-3 text-left font-medium">
                        {d.penghuni?.nama_lengkap}
                    </td>

                    {/* JENIS */}
                    <td className="px-4 py-3 text-center capitalize">
                        {d.jenis_iuran}
                    </td>

                    {/* JUMLAH */}
                    <td className="px-4 py-3 text-right">
                        Rp {Number(d.jumlah).toLocaleString()}
                    </td>

                    {/* BULAN */}
                    <td className="px-4 py-3 text-center">
                        {
                        months.find(
                            (m) => m.value == Number(d.bulan)
                        )?.label
                        }{" "}
                        {d.tahun}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                        <button
                        onClick={() => toggleStatus(d)}
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                            d.status === "lunas"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        >
                        {d.status}
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </Card>
        </div>
    </Layout>
  );
}