<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        return Pengeluaran::when($request->bulan, function ($q) use ($request) {
                $q->where('bulan', $request->bulan);
            })
            ->when($request->tahun, function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
            })
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'keterangan' => 'required',
            'jumlah' => 'required|numeric',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer'
        ]);

        return Pengeluaran::create($data);
    }

    public function destroy($id)
    {
        Pengeluaran::destroy($id);

        return response()->json(['message' => 'deleted']);
    }
}
