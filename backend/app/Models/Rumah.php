<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rumah extends Model
{
    protected $table = 'rumah';

    protected $fillable = [
        'nama_rumah',
        'alamat',
        'status'
    ];

    // 🔥 RELASI HISTORY (pivot model)
    public function histories()
    {
        return $this->hasMany(RumahPenghuni::class)
            ->with('penghuni');
    }

    // 🔥 RELASI PENGHUNI AKTIF
    public function penghuniAktif()
    {
        return $this->hasOne(RumahPenghuni::class)
            ->where('is_active', true)
            ->with('penghuni');
    }

    public function penghuni()
    {
        return $this->belongsToMany(Penghuni::class, 'rumah_penghuni')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active']);
    }
}