<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    protected $table = 'penghuni';

    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'no_telepon',
        'is_menikah'
    ];

    // relasi ke rumah (many to many)
    public function rumah()
    {
        return $this->belongsToMany(Rumah::class, 'rumah_penghuni')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active'])
            ->wherePivot('is_active', true)
            ->withTimestamps();
    }

    // relasi ke pembayaran
    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class);
    }
}
