<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penghuni;

class PenghuniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Penghuni::with('rumah')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_lengkap' => 'required',
            'foto_ktp' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'status_penghuni' => 'required|in:kontrak,tetap',
            'no_telepon' => 'required',
            'is_menikah' => 'required|boolean'
        ]);

        if ($request->hasFile('foto_ktp')) {
            $file = $request->file('foto_ktp');

            $path = $file->store('ktp', 'public'); // 🔥 WAJIB

            $data['foto_ktp'] = $path; // hasilnya: ktp/xxx.jpg
        }

        return Penghuni::create($data);
    }

    public function show($id)
    {
        return Penghuni::with('rumah')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $penghuni = Penghuni::findOrFail($id);

        $penghuni->update($request->all());

        return $penghuni;
    }

    public function destroy($id)
    {
        Penghuni::destroy($id);

        return response()->json(['message' => 'deleted']);
    }
}
