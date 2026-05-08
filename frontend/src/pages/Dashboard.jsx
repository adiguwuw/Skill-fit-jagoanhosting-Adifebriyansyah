import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import api from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [penghuni, setPenghuni] = useState([]);
  const [rumah, setRumah] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [pengeluaranData, setPengeluaranData] = useState([]);

  const [pemasukan, setPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [saldo, setSaldo] = useState(0);

  const [showPemasukan, setShowPemasukan] = useState(true);
  const [showPengeluaran, setShowPengeluaran] = useState(true);

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, r, report, pengeluaranRes] = await Promise.all([
        api.get("/penghuni"),
        api.get("/rumah"),
        api.get("/report/summary"),
        api.get("/pengeluaran"),
      ]);

      setPenghuni(p.data || []);
      setRumah(r.data || []);

      // 🔵 PEMASUKAN PER BULAN
      const pemasukanPerBulan = monthNames.map((nama, index) => {
        const found = report.data.find(
          (item) => Number(item.bulan) === index + 1
        );

        return {
          bulan: nama,
          total: found ? Number(found.total) : 0,
        };
      });

      setChartData(pemasukanPerBulan);

      const totalPemasukan = report.data.reduce(
        (sum, item) => sum + Number(item.total),
        0
      );

      // 🔴 PENGELUARAN PER BULAN
      const pengeluaranPerBulan = monthNames.map((nama, index) => {
        const filtered = pengeluaranRes.data.filter(
          (item) => Number(item.bulan) === index + 1
        );

        const total = filtered.reduce(
          (sum, item) => sum + Number(item.jumlah),
          0
        );

        return {
          bulan: nama,
          total,
        };
      });

      setPengeluaranData(pengeluaranPerBulan);

      const totalPengeluaranCalc = pengeluaranRes.data.reduce(
        (sum, item) => sum + Number(item.jumlah),
        0
      );

      setPemasukan(totalPemasukan);
      setTotalPengeluaran(totalPengeluaranCalc);
      setSaldo(totalPemasukan - totalPengeluaranCalc);

    } catch (err) {
      console.error("Load error:", err);
    }
  };

    // 🔥 GABUNG DATA UNTUK CHART
    const combinedData = monthNames.map((nama, index) => ({
        bulan: nama,
        pemasukan: chartData[index]?.total || 0,
        pengeluaran: pengeluaranData[index]?.total || 0,
    }));

  return (
    <Layout>

      {/* 🔷 SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

        <Card>
          <p className="text-sm text-gray-500">Total Penghuni</p>
          <h2 className="text-2xl font-bold">{penghuni.length}</h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Rumah</p>
          <h2 className="text-2xl font-bold">{rumah.length}</h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Pemasukan</p>
          <h2 className="text-2xl font-bold text-blue-600">
            Rp {pemasukan.toLocaleString("id-ID")}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Pengeluaran</p>
          <h2 className="text-2xl font-bold text-red-500">
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Saldo</p>
          <h2 className="text-2xl font-bold text-green-600">
            Rp {saldo.toLocaleString("id-ID")}
          </h2>
        </Card>

      </div>

      {/* 🔷 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 🔷 LIST PENGHUNI */}
        <div>
          <Card title="Daftar Penghuni">
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {penghuni.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{p.nama_lengkap}</p>
                    <p className="text-xs text-gray-500">
                      {p.rumah?.[0]?.nama_rumah || "Belum ditempati"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs px-2 py-1 rounded ${
                      p.status_penghuni === "tetap"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {p.status_penghuni}
                    </p>

                    <p className="text-xs text-gray-400">
                      {p.no_telepon}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 🔷 CHART */}
        <div className="md:col-span-2">
          <Card title="Grafik Keuangan">

            {/* TOGGLE */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setShowPemasukan(!showPemasukan)}
                className={`px-3 py-1 rounded ${
                  showPemasukan ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Pemasukan
              </button>

              <button
                onClick={() => setShowPengeluaran(!showPengeluaran)}
                className={`px-3 py-1 rounded ${
                  showPengeluaran ? "bg-red-600 text-white" : "bg-gray-200"
                }`}
              >
                Pengeluaran
              </button>
            </div>

            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                  <XAxis
                    dataKey="bulan"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `Rp ${Number(value).toLocaleString("id-ID")}`
                    }
                  />

                  <Legend />

                  {showPemasukan && (
                    <Line
                      type="monotone"
                      dataKey="pemasukan"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  )}

                  {showPengeluaran && (
                    <Line
                      type="monotone"
                      dataKey="pengeluaran"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

          </Card>
        </div>
      </div>

      {/* 🔷 DAFTAR RUMAH */}
      <div className="mt-6">
        <Card title="Daftar Rumah">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {rumah.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:shadow"
              >
                <div>
                  <p className="font-semibold">{r.nama_rumah}</p>
                  <p className="text-xs text-gray-500">
                    {r.alamat || "-"}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    r.status === "dihuni"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {r.status === "dihuni" ? "Dihuni" : "Kosong"}
                </span>
              </div>
            ))}

          </div>
        </Card>
      </div>

    </Layout>
  );
}