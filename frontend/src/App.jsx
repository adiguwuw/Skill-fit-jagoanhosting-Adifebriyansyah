import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Penghuni from "./pages/Penghuni";
import Rumah from "./pages/Rumah";
import Pembayaran from "./pages/Pembayaran";
import Report from "./pages/Report";
import Pengeluaran from "./pages/Pengeluaran";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "12px",
            background: "#fff",
            color: "#333",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/penghuni" element={<Penghuni />} />
        <Route path="/rumah" element={<Rumah />} />
        <Route path="/pembayaran" element={<Pembayaran />} />
        <Route path="/report" element={<Report />} />
        <Route path="/pengeluaran" element={<Pengeluaran />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;