<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RumahPenghuni extends Model
{
    protected $table = 'rumah_penghuni';

    protected $fillable = [
        'rumah_id',
        'penghuni_id',
        'tanggal_masuk',
        'tanggal_keluar',
        'is_active'
    ];

    public function rumah()
    {
        return $this->belongsTo(Rumah::class);
    }

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }
}
