import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { pathname } = useLocation();

  const nav = [
    { name: "Dashboard", to: "/" },
    { name: "Penghuni", to: "/penghuni" },
    { name: "Rumah", to: "/rumah" },
    { name: "Pembayaran", to: "/pembayaran" },
    { name: "Report", to: "/report" },
    { name: "Pengeluaran", to: "/pengeluaran" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold text-blue-600 mb-6">
          🏠 Admin RT
        </h1>

        <nav className="space-y-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded-lg transition ${
                pathname === item.to
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Dashboard
          </h2>

          <div className="text-sm text-gray-400">
            Admin Panel
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}