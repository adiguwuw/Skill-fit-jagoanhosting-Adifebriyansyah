<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rumah;
use App\Models\RumahPenghuni;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;

class RumahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Rumah::with('penghuniAktif')->get();
    }

    public function store(Request $request)
    {
        return Rumah::create($request->all());
    }

    public function show($id)
    {
        $rumah = Rumah::with([
            'penghuni' => function ($q) {
                $q->orderBy('rumah_penghuni.tanggal_masuk', 'desc');
            }
        ])->findOrFail($id);

        return $rumah;
    }

    public function update(Request $request, $id)
    {
        $rumah = Rumah::findOrFail($id);
        $rumah->update($request->all());

        return $rumah;
    }

    public function destroy($id)
    {
        Rumah::destroy($id);
        return response()->json(['message' => 'deleted']);
    }

    public function assignPenghuni(Request $request, $id)
    {
        $request->validate([
            'penghuni_id' => 'required|exists:penghuni,id'
        ]);

        // 🔥 matikan lama
        RumahPenghuni::where('rumah_id', $id)
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'tanggal_keluar' => now()
            ]);

        // 🔥 assign baru (WAJIB TRUE)
        $data = RumahPenghuni::create([
            'rumah_id' => $id,
            'penghuni_id' => $request->penghuni_id,
            'tanggal_masuk' => now(),
            'is_active' => true
        ]);

        // 🔥 DEBUG
        if (!$data) {
            return response()->json(['error' => 'Gagal insert'], 500);
        }

        Rumah::where('id', $id)->update([
            'status' => 'dihuni'
        ]);

        return response()->json([
            'message' => 'Assign berhasil',
            'data' => $data
        ]);
    }

    public function history($id)
    {
        return RumahPenghuni::with('penghuni')
            ->where('rumah_id', $id)
            ->orderByDesc('tanggal_masuk')
            ->get();
    }
}
