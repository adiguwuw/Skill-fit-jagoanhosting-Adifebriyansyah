<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $fillable = [
        'penghuni_id',
        'rumah_id',
        'jenis_iuran',
        'bulan',
        'tahun',
        'jumlah',
        'status',
        'tanggal_bayar'
    ];

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    public function rumah()
    {
        return $this->belongsTo(Rumah::class);
    }
}
