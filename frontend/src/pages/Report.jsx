import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";

export default function Report() {
  const [penghuni, setPenghuni] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detail, setDetail] = useState([]);

  const [filter, setFilter] = useState({
    bulan: "",
    tahun: new Date().getFullYear(),
  });

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

  const jenisList = ["kebersihan", "satpam"];

  // 🔷 LOAD DATA PENGHUNI
  const loadPenghuni = async () => {
    const res = await api.get("/penghuni");
    setPenghuni(res.data);
  };

  useEffect(() => {
    loadPenghuni();
  }, []);

  // 🔷 LOAD DETAIL
  const loadDetail = async (id) => {
    const res = await api.get(
      `/report/penghuni/${id}?bulan=${filter.bulan}&tahun=${filter.tahun}`
    );
    setDetail(res.data);
  };

  const openDetail = async (user) => {
    setSelectedUser(user);
    await loadDetail(user.id);
  };

  // 🔥 NORMALIZE DATA (SELALU 2 JENIS)
  const normalizeData = () => {
    const result = {};
  
    // grouping by bulan
    detail.forEach((item) => {
      const key = `${item.bulan}-${item.tahun}`;
  
      if (!result[key]) {
        result[key] = {
          bulan: item.bulan,
          tahun: item.tahun,
          kebersihan: null,
          satpam: null,
        };
      }
  
      result[key][item.jenis_iuran] = item;
    });
  
    // convert ke array
    return Object.values(result).sort((a, b) => a.bulan - b.bulan);
  };

  // 🔷 DOWNLOAD PDF
  const downloadPDF = (id) => {
    const tahun = filter.tahun || new Date().getFullYear();

    window.open(
      `http://127.0.0.1:8000/api/report/penghuni/pdf/${id}?tahun=${tahun}`,
      "_blank"
    );
  };

  const downloadTahunan = () => {
    const tahun = filter.tahun || new Date().getFullYear();

    window.open(
        `http://127.0.0.1:8000/api/report/pdf-tahunan?tahun=${tahun}`,
        "_blank"
    );
    };

  return (
    <Layout>
        <Card title="Laporan Tahunan">
            <div className="flex items-center gap-3">
                <input
                type="number"
                value={filter.tahun}
                onChange={(e) =>
                    setFilter({ ...filter, tahun: e.target.value })
                }
                className="input w-32"
                placeholder="Tahun"
                />

                <button
                onClick={downloadTahunan}
                className="btn-primary"
                >
                Download PDF Tahunan
                </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
                Export laporan rekap pembayaran seluruh penghuni per bulan dalam 1 tahun
            </p>
        </Card>
      {/* 🔷 LIST PENGHUNI */}
      <Card title="Report Penghuni">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-blue-700">
            <tr>
              <th className="p-3 text-left">Nama</th>
            </tr>
          </thead>

          <tbody>
            {penghuni.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => openDetail(p)}
              >
                <td className="p-3 font-medium text-blue-600 hover:underline">
                  {p.nama_lengkap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 🔥 MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-[800px] max-h-[90vh] overflow-auto rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                Detail - {selectedUser.nama_lengkap}
              </h2>

              <button
                onClick={() => downloadPDF(selectedUser.id)}
                className="btn-primary"
              >
                Download PDF
              </button>
            </div>

            {/* FILTER */}
            <div className="flex gap-2 mb-4">
              <select
                value={filter.bulan}
                onChange={(e) =>
                  setFilter({ ...filter, bulan: e.target.value })
                }
                className="input"
              >
                <option value="">Semua Bulan</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <input
                value={filter.tahun}
                onChange={(e) =>
                  setFilter({ ...filter, tahun: e.target.value })
                }
                className="input"
              />

              <button
                onClick={() => loadDetail(selectedUser.id)}
                className="btn-primary"
              >
                Filter
              </button>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Bulan</th>
                  <th className="p-2 text-center">Kebersihan</th>
                  <th className="p-2 text-center">Satpam</th>
                </tr>
              </thead>

              <tbody>
                {normalizeData().length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-400">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  normalizeData().map((d, i) => (
                    <tr key={i} className="border-t">
                      {/* BULAN */}
                      <td className="p-2">
                        {
                          months.find(
                            (m) => m.value == Number(d.bulan)
                          )?.label
                        }{" "}
                        {d.tahun}
                      </td>

                      <td className="p-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                                d.kebersihan?.status === "lunas"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            >
                            {d.kebersihan?.status || "belum"}
                            </span>

                            <span className="text-xs text-gray-600">
                            Rp{" "}
                            {Number(d.kebersihan?.jumlah || 0).toLocaleString()}
                            </span>
                         </div>
                        </td>

                        <td className="p-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                                d.satpam?.status === "lunas"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            >
                            {d.satpam?.status || "belum"}
                            </span>

                            <span className="text-xs text-gray-600">
                            Rp{" "}
                            {Number(d.satpam?.jumlah || 0).toLocaleString()}
                            </span>
                        </div>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* CLOSE */}
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedUser(null)}
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