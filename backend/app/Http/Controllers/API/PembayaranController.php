<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    // 🔥 GET DATA
    public function index()
    {
        return Pembayaran::with('penghuni')->latest()->get();
    }

    // 🔥 CREATE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'penghuni_id' => 'required|exists:penghuni,id',
            'rumah_id' => 'required|exists:rumah,id',
            'jenis_iuran' => 'required|in:kebersihan,satpam', // 🔥 FIX
            'jumlah' => 'required|numeric',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer',
            'status' => 'required|in:lunas,belum' // 🔥 FIX
        ]);

        return Pembayaran::create($validated);
    }

    // 🔥 UPDATE
    public function update(Request $request, $id)
    {
        $p = Pembayaran::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:lunas,belum'
        ]);

        $p->update($validated);

        return response()->json([
            'message' => 'Status updated',
            'data' => $p
        ]);
    }

    // 🔥 DELETE
    public function destroy($id)
    {
        Pembayaran::destroy($id);

        return response()->json([
            'message' => 'deleted'
        ]);
    }
}