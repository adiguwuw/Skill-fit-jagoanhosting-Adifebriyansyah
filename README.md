# 🏠 Sistem Manajemen RT

Aplikasi ini merupakan sistem manajemen data penghuni dan keuangan RT berbasis web yang dibangun menggunakan Laravel (backend API) dan React (frontend).

---

## 📌 Fitur Utama

### 🔹 Manajemen Penghuni
- Menambahkan dan mengubah data penghuni
- Upload dan preview foto KTP
- Status penghuni (kontrak / tetap)
- Informasi nomor telepon dan status menikah

### 🔹 Manajemen Rumah
- Menambahkan dan mengubah data rumah
- Status rumah (dihuni / kosong)
- Riwayat penghuni pada setiap rumah

### 🔹 Pembayaran Iuran
- Input pembayaran iuran (satpam & kebersihan)
- Status pembayaran (lunas / belum)
- Berdasarkan bulan dan tahun

### 🔹 Pengeluaran
- Input data pengeluaran
- Digunakan untuk perhitungan saldo

### 🔹 Dashboard
- Total penghuni dan rumah
- Total pemasukan dan pengeluaran
- Saldo keuangan
- Grafik pemasukan dan pengeluaran

### 🔹 Report
- Laporan per penghuni
- Laporan tahunan
- Export PDF

---

## 🧱 Teknologi yang Digunakan

- **Backend**: Laravel (PHP Framework)
- **Frontend**: React.js (Vite)
- **Database**: MySQL
- **Library Tambahan**:
  - Recharts (grafik)
  - Axios (API request)

---

## 🏗 Arsitektur Sistem




---

## ⚙️ Panduan Instalasi

### 🔧 1. Clone Repository

```bash
git clone https://github.com/adiguwuw/Skill-fit-jagoanhosting-Adifebriyansyah.git
cd Skill-fit-jagoanhosting-Adifebriyansyah

```
###🔧 2. Setup Backend (Laravel)
```
cd backend
composer install
cp .env.example .env
php artisan key:generate

DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```
🔧 Jalankan Migration
```
php artisan migrate
```
🔧 Storage Link
```
php artisan storage:link
```
Jalankan Server Backend
```
php artisan serve
```
🔧 3. Setup Frontend (React)
```
cd ../frontend
npm install
npm run dev
