<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Penghuni;

class ReportController extends Controller
{
    // 🔥 SUMMARY 1 TAHUN (UNTUK GRAFIK)
    public function summary()
    {
        return Pembayaran::select(
            DB::raw('bulan'),
            DB::raw('tahun'),
            DB::raw('SUM(jumlah) as total')
        )
        ->groupBy('tahun', 'bulan')
        ->orderBy('tahun')
        ->orderBy('bulan')
        ->get();
    }

    // 🔥 DETAIL PER BULAN
    public function monthly(Request $request)
    {
        return Pembayaran::with('penghuni')
            ->where('bulan', $request->bulan)
            ->where('tahun', $request->tahun)
            ->get();
    }

    public function penghuniDetail(Request $request, $id)
    {
        $query = \App\Models\Pembayaran::with('penghuni')
            ->where('penghuni_id', $id);

        if ($request->bulan) {
            $query->where('bulan', $request->bulan);
        }

        if ($request->tahun) {
            $query->where('tahun', $request->tahun);
        }

        return $query->orderBy('bulan')->get();
    }

    public function dashboard()
    {
        return [
            'total_penghuni' => \App\Models\Penghuni::count(),
            'rumah_terisi' => \App\Models\Rumah::where('status', 'dihuni')->count(),
            'total_pemasukan' => \App\Models\Pembayaran::where('status', 'lunas')->sum('jumlah'),
            'tunggakan' => \App\Models\Pembayaran::where('status', 'belum')->sum('jumlah'),
        ];
    }

    public function pdfPerPenghuni(Request $request, $id)
    {
        $tahun = $request->tahun ?? date('Y');

        $penghuni = Penghuni::findOrFail($id);

        // ambil semua pembayaran tahun tsb
        $pembayaran = Pembayaran::where('penghuni_id', $id)
            ->where('tahun', $tahun)
            ->get();

$jenisList = ['satpam', 'kebersihan'];

$data = [];

for ($bulan = 1; $bulan <= 12; $bulan++) {

    $row = [
        'bulan' => $bulan,
        'satpam' => null,
        'kebersihan' => null,
    ];

    foreach ($jenisList as $jenis) {
        $found = $pembayaran->first(function ($item) use ($bulan, $jenis) {
            return $item->bulan == $bulan && $item->jenis_iuran == $jenis;
        });

        $row[$jenis] = [
            'jumlah' => $found ? $found->jumlah : 0,
            'status' => $found ? $found->status : 'belum'
        ];
    }

    // keterangan (semua lunas atau belum)
    $satpamStatus = $row['satpam']['status'] ?? 'belum';
    $kebersihanStatus = $row['kebersihan']['status'] ?? 'belum';

    $row['keterangan'] =
        ($satpamStatus === 'lunas' && $kebersihanStatus === 'lunas')
        ? 'LUNAS'
        : 'BELUM';

    $data[] = $row;
}
        $total_pembayaran = collect($data)
            ->sum(function ($item) {
                return ($item['satpam']['jumlah'] ?? 0) +
                    ($item['kebersihan']['jumlah'] ?? 0);
            });

        $total_lunas = collect($data)
            ->sum(function ($item) {
                return (($item['satpam']['status'] ?? 'belum') === 'lunas' ? ($item['satpam']['jumlah'] ?? 0) : 0) +
                    (($item['kebersihan']['status'] ?? 'belum') === 'lunas' ? ($item['kebersihan']['jumlah'] ?? 0) : 0);
            });

        $ketua_rt = "Bapak Ahmad (Ketua RT 01)"; // 🔥 bisa dari DB kalau mau

        $pdf = Pdf::loadView('pdf.per_penghuni', [
            'penghuni' => $penghuni,
            'data' => $data,
            'tahun' => $tahun,
            'total_lunas' => $total_lunas,
            'ketua_rt' => $ketua_rt
        ]);

        return $pdf->download("laporan-{$penghuni->nama_lengkap}.pdf");
    }

    public function pdfTahunan(Request $request)
    {
        $tahun = $request->tahun ?? date('Y');

        // Ambil semua pembayaran tahun tsb
        $data = Pembayaran::with('penghuni')
            ->where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        // Rekap per bulan
        $months = range(1, 12);
        $rekap = [];

        for ($bulan = 1; $bulan <= 12; $bulan++) {

            $items = $data->where('bulan', $bulan);

            $rekap[] = [
                'bulan' => $bulan,
                'total_penghuni' => $items->pluck('penghuni_id')->unique()->count(),
                'satpam' => $items->where('jenis_iuran', 'satpam')->sum('jumlah'),
                'kebersihan' => $items->where('jenis_iuran', 'kebersihan')->sum('jumlah'),
                'total' => $items->sum('jumlah'),
            ];
        }

        $grand_total = $data->where('status', 'lunas')->sum('jumlah');

        $ketua_rt = "Bapak Ahmad (Ketua RT 01)";

        $pdf = Pdf::loadView('pdf.report_tahunan', [
            'tahun' => $tahun,
            'rekap' => $rekap,
            'grand_total' => $grand_total,
            'ketua_rt' => $ketua_rt
        ])->setPaper('a4', 'portrait');

        return $pdf->download("laporan-tahunan-{$tahun}.pdf");
    }
}